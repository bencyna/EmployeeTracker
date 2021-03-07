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
  populateDepartments();
  populateRoles();
  populateEmployees();
  init();
});

const departments = [];
const departmentId = [];
const roles = [];
const roleId = [];
const employees = [];
const employeeId = [];
// get this good and youre done bruv

let idNum = 0;

function populateDepartments() {
  const query = "SELECT ID, department FROM department";
  connection.query(query, (err, res) => {
    departmentId.splice(0, departmentId.length);
    departments.splice(0, departments.length);
    for (const key in res) {
      departments.push(res[key].department);
      departmentId.push(res[key].ID);
    }
  });
}

function populateRoles() {
  const query = "SELECT ID, title FROM role";
  connection.query(query, (err, res) => {
    roleId.splice(0, roleId.length);
    roles.splice(0, roles.length);
    console.log(res);
    for (const j in res) {
      roles.push(res[j].title);
      roleId.push(res[j].ID);
    }
    console.log("roleid (after push) =  " + roleId);
  });
}

function populateEmployees() {
  const query = "SELECT ID, first_name, last_name FROM employee";
  connection.query(query, (err, res) => {
    employees.splice(0, employees.length);
    employeeId.splice(0, employeeId.length);
    for (const k in res) {
      employees.push(res[k].first_name + " " + res[k].last_name);
      employeeId.push(res[k].ID);
    }
  });
}

function init() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "Choose something to do",
      choices: [
        "View all employees",
        "View departments",
        "View roles",
        "Add a new Employee",
        "Add a new department",
        "Add a new role",
        "exit",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "View departments":
          departmentView();
          break;

        case "View roles":
          rolesView();
          break;

        case "View all employees":
          employeesView();
          break;

        case "Add a new Employee":
          employeesAdd();
          break;

        case "Add a new department":
          departmentAdd();
          break;

        case "Add a new role":
          roleAdd();
          break;

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
}

function departmentView() {
  const query = "SELECT ID, department FROM department";
  connection.query(query, (err, res) => {
    console.table(res);
    init();
  });
}

function rolesView() {
  const query =
    "select role.title, role.salary, department.department from role inner join department on role.department_id = department.ID";
  connection.query(query, (err, res) => {
    console.table(res);
    populateDepartments();
    init();
  });
}
function employeesView() {
  let query =
    "SELECT b.ID, b.first_name, b.last_name, role.title, role.salary, department.department, CONCAT(e.first_name, ' ', e.last_name) as Manager ";
  query += "from employee b ";
  query += "left join employee e on e.id = b.manager_id ";
  query += "inner join role on role.ID = b.role_id ";
  query += "left join department on role.department_id = department.ID;";
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
      const query = "insert into department (department) VALUES (?);";
      connection.query(query, [answers.department], (err, res) => {
        if (err) throw err;
        console.log("something");
      });
    })
    .then(() => {
      populateDepartments();
      departmentView();
    });
};
function employeesAdd() {
  employees.push("No Manager");
  inquirer
    .prompt([
      {
        name: "role",
        type: "list",
        message: "What role would you like this employee to have?",
        choices: roles,
      },
      {
        name: "firstName",
        type: "Input",
        message: "What is the employees first name?",
      },
      {
        name: "lastName",
        type: "Input",
        message: "What is the employees last name?",
      },
      {
        name: "manager",
        type: "list",
        message: "Who is the manager of this employee?",
        choices: employees,
      },
    ])
    .then((answers) => {
      let manId = 0;
      for (let i = 0; i < roleId.length; i++) {
        if (answers.role == roles[i]) {
          idNum = roleId[i];
        }
        if (answers.manager == employees[i]) {
          manId = employeeId[i];
        }
      }
      console.log("emplpyeeId = " + employeeId);
      console.log("roleId = " + roleId);

      const query =
        "insert into employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
      connection.query(
        query,
        [answers.firstName, answers.lastName, idNum, manId],
        (err, res) => {
          if (err) throw err;
        }
      );
    })
    .then(() => {
      populateEmployees();
      employeesView();
    });
}
function roleAdd() {
  inquirer
    .prompt([
      {
        name: "departmentAdd",
        type: "list",
        message: "Which department does this role belong to?",
        choices: departments,
      },
      {
        name: "name",
        type: "input",
        message: "What is the new role called?",
      },
      {
        name: "salary",
        type: "input",
        message: "What is the salary of this role?",
      },
    ])
    .then((answers) => {
      // add validation here for number in salary
      for (let i = 0; i < departmentId.length; i++) {
        if (answers.departmentAdd == departments[i]) {
          idNum = departmentId[i];
          console.log(idNum);
        }
      }
      console.log("DepartmentId = " + departmentId);

      const query =
        "insert into role (title, salary, department_id) VALUES (?, ?, ?);";
      connection.query(
        query,
        [answers.name, answers.salary, idNum],
        (err, res) => {
          if (err) throw err;
        }
      );
    })
    .then(() => {
      populateRoles();
      rolesView();
    });
}
