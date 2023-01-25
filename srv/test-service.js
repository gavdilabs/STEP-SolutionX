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

        

        //////// CHECK VALIDITY PERIOD //////////
        // Get query's start- and endtime (saved as variables near the top)
        // Get project's start- and enddate from project_ID
        // Check if query is within start- and endtime(date) of queried project

        // Get queried project using filter and project_ID from queried WorkHours
        const projFilter = await db.get(Projects).where({"ID": data["projects_ID"]});
        // Get the first (and only) element in the array "projFilter"
        const projData = projFilter[0];
        console.log(projFilter);

        // Create new variables for: "startdate", "enddate", and "projectname"
        const projSD = new Date(projData["startdate"]);
        const projED = new Date(projData["enddate"]);
        const projectName = projData["projectname"];

        // Set hours of project's start- and enddate, and workhours start- and endtime = 0,
        // to only compare the dates in validity period check.
        projSD.setHours(0,0,0);
        projED.setHours(0,0,0);
        startTime.setHours(0,0,0);
        endTime.setHours(0,0,0);

        // Check if start- or endtime of workhours is outside of the validity period of project
        // (starttime/endtime < project startdate || starttime/endtime > enddate)
        if (startTime.getTime() < projSD.getTime() || endTime.getTime() < projSD.getTime() || startTime.getTime() > projED.getTime() || endTime.getTime() > projED.getTime()) {
            req.reject(400, `The work hours selected are outside the validity period for project: '${projectName}'.`);
        }


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