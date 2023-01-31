# Introduction
So far this project contains the back-end functionality necessary to set up a time-regestration service.

## Know issues from Challenge 1
    - Absence does not check across dates (e.g. 23:00-07:00), as we assume the hours does not cross dates.
    - Absence is currently implemented as normal work hours but with a boolean 'absence' set to true - consider its own entity?
    - Validity period check does not take potential start- or end hours into account.
    - 11 hour interval check currently only allows for new registrations of hours to be after the latest entry + 11 hours, probably problematic for admins to fix forgotton entries and/or potentially update old entries.