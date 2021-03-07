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
salary VARCHAR(30),
department_id INTEGER, 
FOREIGN key (department_id) REFERENCES department(ID)
);

CREATE TABLE employee(
ID INTEGER PRIMARY KEY AUTO_INCREMENT,
first_name VARCHAR(30),
last_department VARCHAR(30),
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

CREATE table allEmployees AS
select employeeBase.id, employeeBase.first_name, employeeBase.last_name, employeeBase.title, department.department, employeeBase.salary, employeeBase.manager_id
from employeeBase, department
where employeeBase.department_id = department.ID;

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

select employee.id, employee.first_name, employee.last_name, role.title, department.department, role.salary, employee.manager_id
from employee
inner join on employee.role_id = role.ID
left join on role.department_id = department.department.ID




