namespace my.timemanager;

using { Country, managed } from '@sap/cds/common';


entity User {
    key username : String;
    firstname : String;
    lastname : String;
    profilepicture : LargeBinary;
    title : String;
    workhours : Association to WorkHours;
    project : Association to Project;
    workschedule : Association to many WorkSchedule;
}

entity Admin {
    key username : String;
    firstname : String;
    lastname : String;
    profilepicture : LargeBinary;
    title : String;
}

entity WorkHours {
    key ID : UUID;
    users : Association to many User {username};
    project : Association to Project {ID};
    day : Date;
    starttime : Time;
    endtime : Time;
    //Change information
}

entity Project {
    key ID : UUID;
    projectname : String;
    startdate : Date;
    enddate : Date;
    maximumhours : Decimal;
    workhours : Association to many WorkHours;
    users : Association to many User {username};
    //Change information
}

entity WorkSchedule {
    key ID : UUID;
    weekday : Date;
    startdate : Date;
    enddate : Date;
    starttime : Time;
    endtime : Time;
    user : Association to User {username};
    project : Association to Project {ID};
}