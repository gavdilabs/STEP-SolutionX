# Introduction
So far this project contains the back-end functionality necessary to set up a time-regestration service.

## Know issues from Challenge 1
    - Absence does not check across dates (e.g. 23:00-07:00), as we assume the absence hours does not cross dates.
    - Absence is currently implemented as normal work hours but with a boolean 'absence' set to true - meaning absence is counted towards 11 hour interval check. Consider its own entity?
    - We do not check 11h interval when creating absence hours, so we can still post an hour of absence in the middle of a day. It also means we can post multiple absences on top of each other...
    - Validity period check does not take potential start- or end hours into account.
    - 11 hour interval check currently only allows for new registrations of hours to be after the latest entry + 11 hours. Probably problematic for admins trying fix forgotton entries and/or maybe updating old entries too.
    - We update the currenthours of the project we query before the entity is created - could be problematic if we add more logic 'on CREATE' or 'after CREATE' later.