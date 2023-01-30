using my.timemanager as my from '../db/schema';

service TestService {
  //entity Admins as projection on my.Admins;

  // Following restricts access to Projects, but makes it hard to query...
  entity Projects @(restrict : [
            {
                grant : [ 'READ' ],
                to : [ 'User' ]
            },
            {
                grant : [ '*' ],
                to : [ 'Admin' ]
            }
        ]) as projection on my.Projects;
  //entity Projects as projection on my.Projects;

  entity WorkHours as projection on my.WorkHours;

  entity Users as projection on my.Users;

  entity WorkSchedules as projection on my.WorkSchedules;

  entity DaySchedules as projection on my.DaySchedules;
  entity DayBindings as projection on my.DayBindings;

  function SayHi(message: String) returns String;



}

