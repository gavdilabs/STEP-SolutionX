const cds = require ('@sap/cds');
module.exports = async function(srv) {
    const {WorkHours, Projects, WorkSchedules, DayBindings} = srv.entities;
    
        //Create Handler runs before CREATE finishes. 
    srv.before('CREATE', 'WorkHours', async (req) => {
        


        // Grabs only the requested entities from the DB
        const db = srv.transaction(req);

        // Creates local variable data
        const data = req.data;
        // Creates local variable startTime from request starttime
        const startTime = new Date(data.starttime);
        const endTime = new Date(data.endtime);

        // Take timezone offset into account
        startTime.setMinutes(startTime.getMinutes()+startTime.getTimezoneOffset());
        endTime.setMinutes(endTime.getMinutes()+endTime.getTimezoneOffset());
        
        // Creates local variable userID with request users_ID
        const userID = data.user_ID;



        ///////// CHECK ABSENCE ////////
        // Check if absence is True
        // Creates two new constants containing start and end hours of the workday. 
        if (data.absence) {
            // Create new local constant currentDay, to check against the user's workschedule
            const currentDay = new Date(startTime).getDay();

            // Filters through workSchedules to find the one assigned to the queried user
            const workSchedules = await cds.run(SELECT.from(WorkSchedules)
                .where(`user_ID = '${req.data.user_ID}'`)); 
            const workSchedule = workSchedules[0];

            // Filters through DayBindings using the workScheduleID,
            // returns all rows of the daySchedules.
            const dayBindings = await cds.run(SELECT.from(DayBindings)
                .where(`workScheduleID = '${workSchedule.ID}'`)
                .columns(r => r.daySchedule('*')));
            
            // let allows us to create a variable withour instantiating it
            let givenDaySchedule; 
            // For each element(daySchedule) in dayBindings
            // if the weekday (0-6) is equal to currentDay (queried day)
            // set givenDaySchedule = the element's daySchedule.
            for(const el of dayBindings) {
                if(el.daySchedule.weekday !== currentDay) continue;
                givenDaySchedule = el.daySchedule;
                break;
            }

            // Create local variables for WorkHoursStartTime and EndTime
            // and set them equal to the queried day.
            const WHStartTime = new Date(startTime);
            const WHEndTime = new Date(startTime);

            // Format the from- and totime from the daySchedule from:
            // 00:00:00 to 00,00,00 - so setHours can use the values
            const fromTimeArr = givenDaySchedule.fromtime.split(':');
            const toTimeArr = givenDaySchedule.totime.split(':');
            // Parsing integers from the above arrays to each values of the setHours() function
            WHStartTime.setHours(parseInt(fromTimeArr[0]), parseInt(fromTimeArr[1]), parseInt(fromTimeArr[2]));
            WHEndTime.setHours(parseInt(toTimeArr[0]), parseInt(toTimeArr[1]), parseInt(toTimeArr[2]));


            // Check if start- and endtime of queried workhours is outside of expected working hours,
            // from user's workSchedule.
            // If true, reject. 
            if (!(startTime.getTime() >= WHStartTime.getTime() && endTime.getTime() > WHStartTime.getTime() && startTime.getTime() < WHEndTime.getTime() && endTime.getTime() <= WHEndTime.getTime())) {
                req.reject(400, `You cannot register absence outside of workhours`);
                return;
            }
            return;
        }


        //////// CHECK VALIDITY PERIOD //////////
        // Get query's start- and endtime (saved as variables near the top)
        // Get project's start- and enddate from project_ID
        // Check if query is within start- and endtime(date) of queried project

        // Get queried project using filter and project_ID from queried WorkHours
        const projFilter = await db.get(Projects).where({"ID": data.project_ID});
        // Get the first (and only) element in the array "projFilter"
        const projData = projFilter[0];

        // Create new variables for: "startdate", "enddate", and "projectname"
        const projSD = new Date(projData.startdate);
        const projED = new Date(projData.enddate);
        const projectName = projData.projectname;

        // Set hours of project's start- and enddate, and workhours start- and endtime = 0,
        // to only compare the dates in validity period check.
        projSD.setHours(0,0,0);
        projED.setHours(0,0,0);
        startTime.setHours(0,0,0);
        endTime.setHours(0,0,0);

        // Check if start- or endtime of workhours is outside of the validity period of project
        // if(starttime/endtime is not within project startdate/endtime): reject
        if (!(startTime.getTime() >= projSD.getTime() && endTime.getTime() > projSD.getTime() && startTime.getTime() < projED.getTime() && endTime.getTime() <= projED.getTime())) {
            req.reject(400, `The work hours selected are outside the validity period for project: '${projectName}'.`);
        }




        ///////////// CHECK 11 HOUR INTERVAL ////////////////
        //Filter all workhours with requested users_ID and saves as local variable prevHours. 
        //Await means waiting for query and filter to finish
        const prevHours = await db.get(WorkHours).where({"user_ID": userID});
        
        //For each registration of previous workhours from userID, 
        //we get endtime and saves it as a local varial endTime. 
        //Then we add 11 hours to endtime,
        //and checks if starttime is lower than endtime. 
        //If true, request is rejected. 
        for(const reg of prevHours){
            const uEndTime = new Date(reg.endtime);
            uEndTime.setHours(uEndTime.getHours() + 11);
            if (startTime.getTime() < uEndTime.getTime()) {
                req.reject(400, 'It has been less than 11 hours since last reported work hours');
            }
        }

         


        ////////////// CHECK MAX HOURS ON PROJECT ///////////////
        // Create local constants
        const maximumHours = projData.maximumhours;
        const currentHours = projData.currenthours;
        const st = new Date(data.starttime);
        const et = new Date(data.endtime);
        // Get hourly difference between starttime and endtime
        const registeredHours =  et.getHours() - st.getHours();


        // Check if currentHours + newly registered hours are <= maximumhours
        // If true: update currenthours in the database
        // If false: reject
        if (currentHours + registeredHours <= maximumHours) {
            const newHours = await cds.run(UPDATE(Projects).set(`currenthours = '${currentHours}' + '${registeredHours}'`)
                .where(`ID = '${req.data.project_ID}'`)); 
        }
        else {
            req.reject(400, `The request has exceeded maximum hours for project: '${projectName}'.`);
        }
    })    
}