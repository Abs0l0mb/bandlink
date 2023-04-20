/*
*USER 
*   
*/


CREATE USER 'appUser'@'localhost' IDENTIFIED BY 'Pa$$w9rd';
GRANT ALL PRIVILEGES ON * . * TO 'appUser'@'localhost';
FLUSH PRIVILEGES;


/*-----------------------
---DEMO DATABASE - DATA
-----------------------*/

delete from user_has_admin_rights;
delete from users;
delete from admin_rights;

INSERT INTO users (email, password) VALUES 
('demo-user@gmail.com', SHA2('user-password', 512)),
('demo-admin@gmail.com', SHA2('admin-password', 512));

INSERT INTO admin_rights (name) VALUES 
('USERS'),
('DATA INSERT');

INSERT INTO user_has_admin_rights (user_id,admin_right_id) VALUES 
((SELECT id from users where email = 'demo-admin@gmail.com'), (SELECT id from admin_rights where name = 'USERS')),
((SELECT id from users where email = 'demo-admin@gmail.com'), (SELECT id from admin_rights where name = 'DATA INSERT'));