const inquirer = require("inquirer");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Be sure to update with your own MySQL password!
  password: "hello",
  database: "",
});

function init() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "Choose something to do",
      choices: [
        "View department",
        "View roles",
        "View employees",
        "Add a new Employee",
        "Add a new department",
        "Add a new role within a department",
        "exit",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "View department":
          departmentView();
          break;

        case "View roles":
          rolesView();
          break;

        case "View employees":
          employeesView();
          break;

        case "Add a new Employee":
          employeesAdd();
          break;

        case "Add a new department":
          departmentAdd();
          break;

        case "Add a new role within a department":
          roleAdd();
          break;
      }
    });
}

function departmentView() {
  console.table("hello");
}

function rolesView() {
  console.log("hello");
}
function employeesView() {
  console.log("hello");
}
function departmentAdd() {
  console.log("hello");
}
function employeesAdd() {
  console.log("hello");
}
function roleAdd() {
  console.log("hello");
}

init();
