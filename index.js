const mysql = require("mysql2");
const inquirer = require("inquirer");
require("dotenv").config();

const allDepartmentsQueryString = "SELECT * FROM department";
const allRolesQueryString =
  "SELECT role.id, title, name AS department_name, salary FROM role JOIN department ON department_id = department.id";
const allEmployeesQueryString =
  "SELECT employee.id, employee.first_name, employee.last_name, role.title, manager.first_name AS manager_first_name, manager.last_name AS manager_last_name FROM employee JOIN role ON role_id = role.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id";

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database.`)
);
function promptInitialQuestions() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "firstPromptChoice",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
        ],
      },
    ])
    .then(handleInitialPrompts)
    .catch((error) => {
      console.log("A problem occurred!");
      console.error(error);
    });
}
function handleInitialPrompts(response) {
  switch (response.firstPromptChoice) {
    case "View All Departments":
      viewAllFromTable(allDepartmentsQueryString);
      promptInitialQuestions();
      break;
    case "View All Roles":
      viewAllFromTable(allRolesQueryString);
      promptInitialQuestions();
      break;
    case "View All Employees":
      viewAllFromTable(allEmployeesQueryString);
      promptInitialQuestions();
      break;
    case "Add a Department":
      promptAddDepartment();
      promptInitialQuestions();
      break;
    case "Add a Role":
      break;
    case "Add an Employee":
      break;
    case "Update an Employee Role":
      break;
    default:
      break;
  }
}
function viewAllFromTable(queryString) {
  db.query(queryString, function (err, results) {
    if (err) {
      console.log("A problem occured!");
      console.error(err);
    } else {
      console.table(results);
    }
  });
}
function promptAddDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter a name for the department.",
        name: "departmentName",
        validate: (departmentName) => {
          return departmentName ? true : "A department name is required!";
        },
      },
    ])
    .then((response) => insertDepartment(response.departmentName))
    .catch((error) => {
      console.log("A problem occurred!");
      console.error(error);
    });
}
function insertDepartment(departmentName) {
  db.query(
    `INSERT into department(name) VALUES ("${departmentName}");`,
    function (err, results) {
      if (err) {
        console.log(err);
      }
      console.log(
        `A record for ${departmentName} has been inserted into the department table.`
      );
      viewAllFromTable(allDepartmentsQueryString);
    }
  );
}

function promptAddRole() {
  // prepare related data
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter a title for the role.",
        name: "title",
        validate: (response) => {
          return response ? true : "A title is required!";
        },
      },
      {
        type: "input",
        message: "Enter a salary for the role. (optional)",
        name: "salary",
      },
      {
        type: "list",
        message: "Enter the id of the role's department. (optional)",
        choices: ["QUERY DEPARTMENTS AND LOAD"],
        name: "departmentId",
      },
    ])
    .then((response) => insertRole(response.departmentName))
    .catch((error) => {
      console.log("A problem occurred!");
      console.error(error);
    });
}
/*
function insertRole() {
  db.query(
    `INSERT into department(name) VALUES ("${departmentName}");`,
    function (err, results) {
      if (err) {
        console.log(err);
      }
      promptInitialQuestions();
    }
  );
}
*/
//promptInitialQuestions();   MY INIT
