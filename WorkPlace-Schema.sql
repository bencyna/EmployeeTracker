DROP DATABASE IF EXISTS workPlace_db;
CREATE database workPlace_db;

USE workPlace_db;

CREATE TABLE department(
ID INTEGER PRIMARY KEY AUTO_INCREMENT,
NAME VARCHAR(30)
);

CREATE TABLE role(
ID INTEGER PRIMARY KEY AUTO_INCREMENT,
title VARCHAR(30),
salary VARCHAR(30),
department_id INTEGER, 
FOREIGN key (department_id) REFERENCES department(ID)
);

CREATE TABLE employee(
ID INTEGER PRIMARY KEY AUTO_INCREMENT,
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id INTEGER,
manager_id INTEGER, 
FOREIGN key (role_id) REFERENCES role(department_id),
FOREIGN key (manager_id) REFERENCES role(department_id)
);


