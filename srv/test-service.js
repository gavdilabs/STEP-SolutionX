const cds = require ('@sap/cds');
module.exports = async function(srv) {
    const {WorkHours, Projects} = srv.entities;

        // Filter WorkHours on querer's UUID and endtime
        // Check if starttime is > 11 hours past from previous Endtime
        // If below is true = succeed, else = don't
    
        //Create Handler runs before CREATE finishes. 
    srv.before('CREATE', 'WorkHours', async (req) => {
        
        //Grabs only the requested entities from the DB
        const db = srv.transaction(req);

        //creates local variable data
        const data = req.data;
        //creates local variable startTime from request starttime
        const startTime = new Date(data["starttime"]);
        const endTime = new Date(data["endtime"]);

        
        //creates local variable userID with request users_ID
        const userID = data["users_ID"];

        ///////////// CHECK 11 HOUR INTERVAL ////////////////
        //Filter all workhours with requested users_ID and saves as local variable prevHours. 
        //Await means waiting for query and filter to finish
        const prevHours = await db.get(WorkHours).where({"users_ID": userID});
        
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

        //////// CHECK VALIDITY PERIOD //////////
        // Get query's start- and endtime
        // Get project_ID and project's start- and enddate
        // Check if query is within start- and endtime(date) of queried project

        const projectName = data["projectname"];
        const projSD = new Date(["startdate"]);
        const projED = new Date(["enddate"]);

        projSD.setTime(0,0,0,0);
        projED.setTime(0,0,0,0);
        startTime.setTime(0,0,0,0);
        endTime.setTime(0,0,0,0);
        console.log(endTime)

        if (startTime.getTime() < projSD.getTime() && startTime.getTime() > projED.getTime() && endtime.getTime() < projSD.getTime() && endTime.getTime() > projED.getTime()) {
            req.reject(400, `The work hours selected are out the project: ${projectName}'s validity period`);
        }
        
    })

}



    // (ID = 'value' and ID = 'value') or Name eq 'halløj'
    // {ID: value, and: {ID: value}}

    // SELECT FROM WorkHours WHERE "" COLUMNS ""

    // SELECT.from(WorkHours).columns(el => el.ID, el.EndDate, el.UserNav(u => u.ID))

    //check workhours på last modified, WH filter med alt og lav check
    //lav loop til at checke dato 
    //Alle former for logic comparison kan laves i filter
    //Lav WH når de stempler ind, updater når de checker ud. 
    //compare med end-time, find alle end-time min. 11 timer fra nu.