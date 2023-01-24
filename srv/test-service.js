const cds = require ('@sap/cds');
module.exports = async function(srv) {
    const {WorkHours} = srv.entities;

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
        
        //creates local variable userID with request users_ID
        const userID = data["users_ID"];
        //Filter all workhours with requested users_ID and saves as local variable prevHours. 
        //Await means waiting for query and filter to finish
        const prevHours = await db.get(WorkHours).where({"users_ID": userID});
        
        //For each registration of previous workhours from userID, 
        //we get endtime and saves it as a local varial endTime. 
        //Then we add 11 hours to endtime,
        //and checks if starttime is lower than endtime. 
        //If true, request is rejected. 
        for(const reg of prevHours){
            const endTime = new Date(reg.endtime);
            endTime.setHours(endTime.getHours() +11);
            if (startTime.getTime() < endTime.getTime()) {
                req.reject(400, 'der er under 11 timer');
            }
        
        

        }
        
        //console.log(req);
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