const mysql = require("mysql2/promise");
const inquirer = require("inquirer");
require("dotenv").config();

const allDepartmentsQueryString = "SELECT * FROM department";
const allRolesQueryString =
  "SELECT role.id, title, name AS department_name, salary FROM role JOIN department ON department_id = department.id";
const allEmployeesQueryString =
  "SELECT employee.id, employee.first_name, employee.last_name, role.title, manager.first_name AS manager_first_name, manager.last_name AS manager_last_name FROM employee JOIN role ON role_id = role.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id";

var db;

async function init() {
  db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "employee_db",
  });
  await promptInitialQuestions();
}
async function promptInitialQuestions() {
  try {
    const response = await inquirer.prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "initialPromptChoice",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
          "Quit",
        ],
      },
    ]);
    handleInitialPrompts(response.initialPromptChoice);
  } catch (error) {
    console.log("A problem occurred!");
    console.error(error);
  }
}
async function handleInitialPrompts(initialPromptChoice) {
  switch (initialPromptChoice) {
    case "View All Departments":
      await viewAllFromTable(allDepartmentsQueryString);
      await promptInitialQuestions();
      break;
    case "View All Roles":
      await viewAllFromTable(allRolesQueryString);
      await promptInitialQuestions();
      break;
    case "View All Employees":
      await viewAllFromTable(allEmployeesQueryString);
      await promptInitialQuestions();
      break;
    case "Add a Department":
      await promptAddDepartment();
      await promptInitialQuestions();
      break;
    case "Add a Role":
      await prepareDataAndPromptAddRole();
      await promptInitialQuestions();
      break;
    case "Add an Employee":
      await prepareDataAndPromptAddEmployee();
      await promptInitialQuestions();
      break;
    case "Update an Employee Role":
      await prepareDataAndPromptUpdateEmployee();
      await promptInitialQuestions();
      break;
    case "Quit":
      process.exit(0);
    default:
      break;
  }
}
async function viewAllFromTable(queryString) {
  try {
    const response = await db.execute(queryString);
    console.table(response[0]);
  } catch (error) {
    consoleLogError(error);
  }
}
async function promptAddDepartment() {
  try {
    const response = await inquirer.prompt([
      {
        type: "input",
        message: "Enter a name for the department.",
        name: "departmentName",
        validate: (departmentName) => {
          return departmentName ? true : "A department name is required!";
        },
      },
    ]);
    await insertDepartment(response);
  } catch (error) {
    consoleLogError(error);
  }
}
async function insertDepartment(departmentData) {
  try {
    const response = await db.execute(
      `INSERT INTO department(name) VALUES ("${departmentData.departmentName}");`
    );
    console.log(
      `A record for ${departmentData.departmentName} has been inserted into the department table with id ${response[0].insertId}.`
    );
  } catch (error) {
    consoleLogError(error);
  }
}
async function prepareDataAndPromptAddRole() {
  try {
    const departments = await db.execute("SELECT id, name FROM department");
    const choiceList = departments[0].map(
      (dept) => new ChoiceOption(dept.id, dept.name)
    );
    await promptAddRole(choiceList);
  } catch (error) {
    consoleLogError(error);
  }
}
async function promptAddRole(departments) {
  try {
    const responses = await inquirer.prompt([
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
        default: 0,
      },
      {
        type: "list",
        message: "Enter the id of the role's department.",
        choices: departments,
        name: "departmentId",
      },
    ]);
    await insertRole(responses);
  } catch (error) {
    consoleLogError(error);
  }
}
async function insertRole(roleData) {
  try {
    const response = await db.execute(
      `INSERT into role(title, salary, department_id) VALUES ("${roleData.title}", ${roleData.salary}, ${roleData.departmentId});`
    );
    console.log(
      `A record for ${roleData.title} has been inserted into the role table with id ${response[0].insertId}.`
    );
  } catch (error) {
    consoleLogError(error);
  }
}
async function prepareDataAndPromptAddEmployee() {
  try {
    const roles = await db.execute("SELECT role.id, title FROM role");
    const roleChoiceList = roles[0].map(
      (role) => new ChoiceOption(role.id, role.title)
    );
    const employees = await db.execute(
      "SELECT id, first_name, last_name FROM employee"
    );
    const managerChoiceList = employees[0].map(
      (employee) =>
        new ChoiceOption(
          employee.id,
          employee.first_name + " " + employee.last_name
        )
    );
    managerChoiceList.push(new ChoiceOption(null, "None"));
    await promptAddEmployee(roleChoiceList, managerChoiceList.reverse());
  } catch (error) {
    consoleLogError(error);
  }
}
async function promptAddEmployee(roleChoices, managerChoices) {
  try {
    const responses = await inquirer.prompt([
      {
        type: "input",
        message: "Enter a first name.",
        name: "firstName",
        validate: (response) => {
          return response ? true : "A first name is required!";
        },
      },
      {
        type: "input",
        message: "Enter a last name.",
        name: "lastName",
        validate: (response) => {
          return response ? true : "A last name is required!";
        },
      },
      {
        type: "list",
        message: "Select the employee's role.",
        choices: roleChoices,
        name: "roleId",
      },
      {
        type: "list",
        message: "Select the employee's manager. (optional)",
        choices: managerChoices,
        name: "managerId",
      },
    ]);
    await insertEmployee(responses);
  } catch (error) {
    consoleLogError(error);
  }
}
async function insertEmployee(employeeData) {
  try {
    const response = await db.execute(
      `INSERT into employee(first_name, last_name, role_id, manager_id) VALUES ("${employeeData.firstName}", "${employeeData.lastName}", ${employeeData.roleId},${employeeData.managerId});`
    );
    console.log(
      `A record for ${employeeData.firstName} ${employeeData.lastName} has been inserted into the employee table with id ${response[0].insertId}.`
    );
  } catch (error) {
    consoleLogError(error);
  }
}
async function prepareDataAndPromptUpdateEmployee() {
  try {
    const roles = await db.execute("SELECT role.id, title FROM role");
    const roleChoiceList = roles[0].map(
      (role) => new ChoiceOption(role.id, role.title)
    );
    const employees = await db.execute(
      "SELECT id, first_name, last_name FROM employee"
    );
    const employeeChoiceList = employees[0].map(
      (employee) =>
        new ChoiceOption(
          employee.id,
          employee.first_name + " " + employee.last_name
        )
    );
    await promptUpdateEmployeeRole(employeeChoiceList, roleChoiceList);
  } catch (error) {
    consoleLogError(error);
  }
}
async function promptUpdateEmployeeRole(employees, roles) {
  try {
    const responses = await inquirer.prompt([
      {
        type: "list",
        message: "Which employee needs their role updated?",
        name: "employeeId",
        choices: employees,
      },
      {
        type: "list",
        message: "What should their new role be?",
        name: "roleId",
        choices: roles,
      },
    ]);
    await updateEmployeeRole(responses);
  } catch (error) {
    consoleLogError(error);
  }
}
async function updateEmployeeRole(employeeData) {
  try {
    const response = await db.execute(
      `UPDATE employee SET role_id = ${employeeData.roleId} WHERE id = ${employeeData.employeeId}`
    );
    console.log("The employee's role has been updated!");
  } catch (error) {
    consoleLogError(error);
  }
}
function consoleLogError(error) {
  console.log("A problem occurred!");
  console.error(error);
}
//The attributes of this class have been built to respect the structure for "choice objects" that are used by inquirer prompts.
//The value in 'name' is displayed to users.  The value in... 'value' is stored in the response.
class ChoiceOption {
  constructor(id, name) {
    this.value = id;
    this.name = name;
  }
}
init();
