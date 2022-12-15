using my.timemanager as my from '../db/schema';

service CatalogService {
  entity Admins @readonly as projection on my.Admin;
  entity Projects @readonly as projection on my.Project;
  entity Users @insertonly as projection on my.User;
}