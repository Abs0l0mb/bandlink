/*---------------------------
---DEMO DATABASE - STRUCTURE
----------------------------*/

DROP DATABASE IF EXISTS demo;
CREATE DATABASE demo;
USE demo;

/*--------
---USERS
--------*/

CREATE TABLE users (
	id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
	email VARCHAR(320) NOT NULL UNIQUE,
	password TEXT NOT NULL,
  	update_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  	create_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

/*-----------
---SESSIONS
-----------*/

CREATE TABLE sessions (
	id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
	user_id INTEGER NOT NULL,
	user_agent_hash VARCHAR(64),
	session_cookie VARCHAR(128),
	session_header VARCHAR(128),
	last_activity VARCHAR(200),
	last_ip VARCHAR(46),
	browser_name VARCHAR(30),
	browser_version VARCHAR(30),
	os_name VARCHAR(30),
	os_version VARCHAR(30),
	device_type VARCHAR(30),
	update_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	create_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT sessions_users_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

/*--------------
--ADMIN RIGHTS
--------------*/

CREATE TABLE admin_rights (
	id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(100) NOT NULL UNIQUE,
 	update_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	create_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

/*------------------------
---USER HAS ADMIN RIGHTS
------------------------*/

CREATE TABLE user_has_admin_rights (
	id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
	user_id INTEGER NOT NULL,
	admin_right_id INTEGER NOT NULL,
	update_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	create_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT user_has_admin_rights_users_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
	CONSTRAINT user_has_admin_rights_access_rights_fk FOREIGN KEY (admin_right_id) REFERENCES admin_rights(id) ON DELETE CASCADE
);
