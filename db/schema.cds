namespace my.timemanager;

using { cuid, Country, managed } from '@sap/cds/common';
//country ??

entity Users : cuid {
    username : String not null;
    firstname : String not null;
    lastname : String not null;
    profilepicture : LargeBinary;
    title : String not null;
    workhour : Association to many WorkHours;
    workschedule : Association to many WorkSchedules;
    admin : Boolean not null;
}

entity WorkHours : managed, cuid {
    user : Association to one Users not null;
    project : Association to one Projects not null;
    starttime : DateTime not null;
    endtime : DateTime not null;
    absence : Boolean not null;
    //managed = Change information
}

entity Projects : managed, cuid {
    projectname : String not null;
    startdate : Date not null;
    enddate : Date not null;
    maximumhours : Decimal not null;
    currenthours: Decimal;
    user : Association to many Users;
    //Change information
}

entity WorkSchedules : cuid {
    startdate : Date not null; //based on contract
    enddate : Date not null; //based on contract
    starttime : Time not null; 
    endtime : Time not null;
    user : Association to Users not null;
    dayschedules : Association to many DayBindings on ID = dayschedules.workScheduleID;
}

entity DayBindings {
    key workScheduleID: String; 
    key dayScheduleID: String; 
    workSchedule: Association to one WorkSchedules on workScheduleID = workSchedule.ID;
    daySchedule: Association to one DaySchedules on dayScheduleID = daySchedule.ID;
}

entity DaySchedules: cuid, managed {
    fromtime : Time not null; 
    totime : Time not null;
    weekday : Integer enum {
        Sunday = 0;
        Monday = 1;
        Tuesday = 2;
        Wednesday = 3;
        Thursday = 4;
        Friday = 5;
        Saturday = 6; 
    } not null;
}



// entity Admins {
//     key username : String;
//     firstname : String;
//     lastname : String;
//     profilepicture : LargeBinary;
//     title : String;
// }
