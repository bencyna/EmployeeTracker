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
    for (const j in res) {
      roles.push(res[j].title);
      roleId.push(res[j].ID);
    }
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
        "Remove an employee",
        "Remove a role",
        "Remove a department",
        "See total wages",
        "Veiw Employees by manager",
        "Update employee role",
        "Update employee's manager",
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

        case "Remove an employee":
          deleteEmployee();
          break;

        case "Remove a role":
          deleteRole();
          break;

        case "Remove a department":
          deleteDepartment();
          break;

        case "See total wages":
          totalWages();
          break;

        case "Veiw Employees by manager":
          managersVeiw();
          break;

        case "Update employee role":
          updateRole();
          break;

        case "Update employee's manager":
          updateManager();
          break;

        case "exit":
          console.log("goodbye");
          process.exit();

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
      if (isNaN(answers.salary)) {
        console.log("Salary must contain numbers only");
        process.exit();
      }
      for (let i = 0; i < departmentId.length; i++) {
        if (answers.departmentAdd == departments[i]) {
          idNum = departmentId[i];
        }
      }
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

function deleteEmployee() {
  let deleteId = 0;
  inquirer
    .prompt([
      {
        name: "employee",
        type: "list",
        message: "Which employee do you want to remove?",
        choices: employees,
      },
    ])
    .then((answers) => {
      for (let i = 0; i < employees.length; i++) {
        if (answers.employee == employees[i]) {
          deleteId = employeeId[i];
        }
        const query = "DELETE FROM employee WHERE id = ?;";
        connection.query(query, [deleteId], (err, res) => {
          if (err) throw err;
        });
      }
    })
    .then(() => {
      populateEmployees();
      employeesView();
    });
}

function deleteRole() {
  let deleteId = 0;
  inquirer
    .prompt([
      {
        name: "role",
        type: "list",
        message: "Which role do you want to remove?",
        choices: roles,
      },
    ])
    .then((answers) => {
      for (let i = 0; i < roles.length; i++) {
        if (answers.role == roles[i]) {
          deleteId = roleId[i];
        }
        const query = "DELETE FROM role WHERE id = ?;";
        connection.query(query, [deleteId], (err, res) => {
          if (err) console.log("Cannot delete a role with current employee(s)");
        });
      }
    })
    .then(() => {
      populateRoles();
      rolesView();
    });
}

function deleteDepartment() {
  let deleteId = 0;
  inquirer
    .prompt([
      {
        name: "Department",
        type: "list",
        message: "Which Department do you want to remove?",
        choices: departments,
      },
    ])
    .then((answers) => {
      for (let i = 0; i < departments.length; i++) {
        if (answers.Department == departments[i]) {
          deleteId = departmentId[i];
        }
        const query = "DELETE FROM department WHERE id = ?;";
        connection.query(query, [deleteId], (err, res) => {
          if (err)
            console.log("Cannot delete a Department with (an) active role(s)");
        });
      }
    })
    .then(() => {
      populateDepartments();
      departmentView();
    });
}

function totalWages() {
  const query =
    "SELECT SUM(salary) AS 'Total Wages' from employee inner join role on role.id = employee.role_id;";
  connection.query(query, (err, res) => {
    console.table(res);
    init();
  });
}

function managersVeiw() {
  inquirer
    .prompt({
      name: "manager",
      type: "list",
      message: "Which manager's employee's do you want to see?",
      choices: employees,
    })
    .then((answers) => {
      for (let i = 0; i < employees.length; i++) {
        if (answers.manager == employees[i]) {
          idNum = employeeId[i];
        }
      }
      let query =
        "SELECT b.ID, b.first_name, b.last_name, role.title, role.salary, department.department, CONCAT(e.first_name, ' ', e.last_name) as Manager ";
      query += "from employee b ";
      query += "left join employee e on e.id = b.manager_id ";
      query += "inner join role on role.ID = b.role_id ";
      query += "left join department on role.department_id = department.ID ";
      query += "where b.manager_id = ?;";
      connection.query(query, [idNum], (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
      });
    });
}

function updateRole() {
  let newRole = 0;
  inquirer
    .prompt([
      {
        name: "employee",
        type: "list",
        message: "Which employee do you want to update?",
        choices: employees,
      },
      {
        name: "role",
        type: "list",
        message: "What is the new role for this employee",
        choices: roles,
      },
    ])
    .then((answers) => {
      for (let i = 0; i < employees.length; i++) {
        if (answers.employee == employees[i]) {
          idNum = employeeId[i];
        }
        if (answers.role == roles[i]) {
          newRole = roleId[i];
        }
      }
      const query = "update employee set role_id = ? where id = ?";
      connection.query(query, [newRole, idNum], (err, res) => {
        if (err) throw err;
      });
    })
    .then(() => {
      employeesView();
    });
}

function updateManager() {
  let newManager = 0;
  inquirer
    .prompt([
      {
        name: "employee",
        type: "list",
        message: "Which employee do you want to update?",
        choices: employees,
      },
      {
        name: "manager",
        type: "list",
        message: "Who is the new manager for this employee",
        choices: employees,
      },
    ])
    .then((answers) => {
      for (let i = 0; i < employees.length; i++) {
        if (answers.employee == employees[i]) {
          idNum = employeeId[i];
        }
        if (answers.manager == employees[i]) {
          newManager = employeeId[i];
        }
      }
      const query = "update employee set manager_id = ? where id = ?";
      connection.query(query, [newManager, idNum], (err, res) => {
        if (err) throw err;
      });
    })
    .then(() => {
      employeesView();
    });
}
