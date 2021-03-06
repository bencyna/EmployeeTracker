const inquirer = require("inquirer");
const mysql = require("mysql");
const sequelize = require("./config/connection");
const employee = require("./lib/employee");
// const connection = mysql.createConnection(sequelize);

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "workPlace_db",
});

connection.connect((err) => {
  if (err) throw err;
  init();
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

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
}

function departmentView() {
  const query = "SELECT ID, NAME FROM department";
  connection.query(query, (err, res) => {
    console.table(res);
    init();
  });
}

function rolesView() {
  const query = "SELECT title, salary FROM role";
  connection.query(query, (err, res) => {
    console.table(res);
    init();
  });
}
function employeesView() {
  const query = "SELECT * FROM allEmployees";
  connection.query(query, (err, res) => {
    console.table(res);
    init();
  });
}
const departmentAdd = () => {
  inquirer
    .prompt({
      name: "department",
      type: "input",
      message: "What is the new department called?",
    })
    .then((answers) => {
      console.log("('" + answers.department + "')");
      const query = "insert into department (NAME) VALUES (?);";
      connection.query(query, [answers.department], (err, res) => {
        if (err) throw err;
        console.log("something");
      });
    })
    .then(() => {
      departmentView();
    });
};
function employeesAdd() {
  init();
}
function roleAdd() {
  init();
}

// init();
