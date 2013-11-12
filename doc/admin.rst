Server Administration
======================

Admin Operations
----------------
All of these should be run in the /admin folder

* List users:  python users.py list_users
  *  Each user gets for rows (userid, info, flags, uflags)
  *  You'll need userid for the other commands
* Add a user (only needed if config.go has allowAllUsers = false): python users.py {{userid}} set_flag flags user
