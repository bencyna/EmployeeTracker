-- DROP DATABASE IF EXISTS workPlace_db; 
CREATE database workPlace_db;

USE workPlace_db;

CREATE TABLE department(
ID INTEGER PRIMARY KEY AUTO_INCREMENT,
department VARCHAR(30)
);

CREATE TABLE role(
ID INTEGER PRIMARY KEY AUTO_INCREMENT,
title VARCHAR(30),
salary Integer,
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

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;

INSERT INTO department (department) 
VALUES ("Sports"), ("Developer"), ("Psychologists");

INSERT INTO role (title, salary, department_id)
VALUES ("Sportsman", 2000000, 1), ("Web-developer", 70000, 2), ("Engineer", 130000, 3);

insert into employee (first_name, last_name, role_id)
values ("Ben", "Cyna", 2), ("Helena", "Geb", 1);

drop TABLE IF EXists employeeBase;

CREATE table employeeBase AS
SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, role.department_id, employee.manager_id
FROM employee, role 
where role.ID = employee.role_id;

SELECT * FROM employeeBase;

DROP table IF EXISTS allEmployees;

create table rolesDepartment AS
Select role.title, role.salary, department.department
FROM role, department
where role.department_id = department.ID; 

Select * from rolesDepartment;

SELECT * FROM allEmployees;

SELECT * FROM allEmployees WHERE first_name = "Ben";

SELECT title, salary FROM role;

INSERT INTO department (department) 
VALUES ("hello");

select * from department;

insert into department (department) VALUES ('tus');

insert into role (title, salary, department_id) 
VALUES ("Footballer", 500000, 1);


SELECT employee.ID, employee.first_name, employee.last_name, role.title, role.salary, department.department,employee.manager_id
from employee
inner join role on role.ID = employee.role_id
left join department on role.department_id = department.ID;

select first_name + ' ' + last_name as Name from employee;

select CONCAT(first_name, " ", last_name) as Name 
from employee;


  SELECT b.id, b.first_name, b.last_name, b.manager_id as managerid, CONCAT(e.first_name, " ", e.last_name) as Manager
    from employee b
    left join employee e on e.id = b.manager_id;
    
    SELECT b.ID, b.first_name, b.last_name, role.title, role.salary, department.department, CONCAT(e.first_name, " ", e.last_name) as Manager
from employee b
left join employee e on e.id = b.manager_id
inner join role on role.ID = b.role_id
left join department on role.department_id = department.ID;
