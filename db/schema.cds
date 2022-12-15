namespace my.timemanager;

using { Country, managed } from '@sap/cds/common';


entity User {
    key username : String;
    firstname : String;
    lastname : String;
    profilepicture : LargeBinary;
    title : String;
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
    user : Association to User {username};
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
    //Change information
}

entity WorkSchedule {
    key ID : UUID;
    user : Association to User {username};
    project : Association to Project {ID};
    weekday : Date;
    startdate : Date;
    enddate : Date;
    starttime : Time;
    endtime : Time;
}