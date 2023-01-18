namespace my.timemanager;

using { cuid, Country, managed } from '@sap/cds/common';


entity Users {
    key username : String;
    firstname : String;
    lastname : String;
    profilepicture : LargeBinary;
    title : String;
    workhours : Association to WorkHours;
    project : Association to Projects;
    workschedule : Association to many WorkSchedules;
    admin : Boolean;
}

entity WorkHours : managed, cuid {
    users : Association to many Users {username};
    project : Association to Projects {ID};
    day : Date;
    starttime : Time;
    endtime : Time;
    //Change information
}

entity Projects : managed, cuid {
    projectname : String;
    startdate : Date;
    enddate : Date;
    maximumhours : Decimal;
    workhours : Association to many WorkHours;
    users : Association to many Users {username};
    //Change information
}

entity WorkSchedules : cuid {
    weekday : Date;
    startdate : Date;
    enddate : Date;
    starttime : Time;
    endtime : Time;
    user : Association to Users {username};
    project : Association to Projects {ID};
}

// entity Admins {
//     key username : String;
//     firstname : String;
//     lastname : String;
//     profilepicture : LargeBinary;
//     title : String;
// }
