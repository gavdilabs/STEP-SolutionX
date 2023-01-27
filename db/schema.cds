namespace my.timemanager;

using { cuid, Country, managed } from '@sap/cds/common';
//country ??

entity Users : cuid {
    username : String;
    firstname : String;
    lastname : String;
    profilepicture : LargeBinary;
    title : String;
    workhours : Association to many WorkHours;
    workschedule : Association to many WorkSchedules;
    admin : Boolean;
}

entity WorkHours : managed, cuid {
    users : Association to Users on users.username = users_ID; 
    users_ID : String; //foreign key
    projects : Association to many Projects on projects.ID = projects_ID; 
    projects_ID : String; //foreign key
    day : Date;
    starttime : DateTime;
    endtime : DateTime;
    absence : Boolean;
    //managed = Change information
}

entity Projects : managed, cuid {
    projectname : String;
    startdate : Date;
    enddate : Date;
    maximumhours : Decimal;
    currenthours: Decimal;
    users : Association to many Users {username};
    //Change information
}

entity WorkSchedules : cuid {
    startdate : Date; //based on contract
    enddate : Date; //based on contract
    starttime : Time; 
    endtime : Time;
    user : Association to Users on user.username = user_ID;
    user_ID : String; //foreign key
    dayschedule : Association to many DaySchedules;
}

entity DaySchedules: cuid, managed {
    fromtime : Time not null; 
    totime : Time not null;
    weekday : Integer enum {
        Monday = 0;
        Tuesday = 1;
        Wednesday = 2;
        Thursday = 3;
        Friday = 4;
        Saturday = 5; 
        Sunday = 6;
    } not null;
}



// entity Admins {
//     key username : String;
//     firstname : String;
//     lastname : String;
//     profilepicture : LargeBinary;
//     title : String;
// }
