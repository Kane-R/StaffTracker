const mysql = require("mysql");
const cTable = require('console.table');
const inquirer = require ('inquirer'); 
const connection = mysql.createConnection({
  host: "localhost",

  // Your port;
  port: 8080,

  // Your username
  user: "root",

  password: "root",
  database: "staff_DB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  start(); 
});

function start(){
  inquirer
  .prompt ([
    {
      type: "list", 
      message: "What would you like to do?",
      name: "start",
      choices: [
      "Add staff", 
      "View all staff", 
      "Remove staff",
      "Add Department", 
      "View all Departments",
      "Add Roles", 
      "View all Roles", 
      "Update staff Role", 
      "Exit"
    ]
    }
  ])
  .then (function(res){
    switch (res.start){

      case "Add staff":
      addstaff();
      break;
     
      case "View all staff":
      viewAllstaff();
      break; 

      case "Remove staff": 
      removestaff(); 
      break;
    
      case "Add Department": 
      addDept(); 
      break;

      case "View all Departments":
      viewAllDept();
      break;

      case "Add Roles": 
      addRole(); 
      break;

      case "View all Roles": 
      viewAllRoles(); 
      break;
    
      case "Update staff Role":
      updatestaffRole(); 
      break;

      case "Exit":
      connection.end(); 
      break; 
    }
  })
}

function addstaff() {
console.log("Inserting a new staff.\n");
inquirer 
  .prompt ([ 
    {
      type: "input", 
      message: "First Name?",
      name: "first_name",
    },
    {
      type: "input", 
      message: "Last Name?",
      name: "last_name"
    },
    {
      type: "list",
      message: "What is the staff's role?",
      name: "role_id", 
      choices: [1,2,3]
    },
    {
      type: "input", 
      message: "Who is their manager?",
      name: "manager_id"
    }
  ])
  .then (function(res){
    const query = connection.query(
      "INSERT INTO staff SET ?", 
     res,
      function(err, res) {
        if (err) throw err;
        console.log( "staff added!\n");

        start (); 
      }
    );    
  })
}
function viewAllstaff() {

  connection.query("SELECT staff.first_name, staff.last_name, roles.title AS \"role\", managers.first_name AS \"manager\" FROM staff LEFT JOIN roles ON staff.role_id = roles.id LEFT JOIN staff managers ON staff.manager_id = managers.id GROUP BY staff.id",  
  function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);
    start();
  });
}

function removestaff(){
  let staffList = [];
  connection.query(
    "SELECT staff.first_name, staff.last_name FROM staff", (err,res) => {
      for (let i = 0; i < res.length; i++){
        staffList.push(res[i].first_name + " " + res[i].last_name);
      }
  inquirer 
  .prompt ([ 
    {
      type: "list", 
      message: "Which staff would you like to delete?",
      name: "staff",
      choices: staffList

    },
  ])
  .then (function(res){
    const query = connection.query(
      `DELETE FROM staff WHERE concat(first_name, ' ' ,last_name) = '${res.staff}'`,
        function(err, res) {
        if (err) throw err;
        console.log( "staff deleted!\n");
     start();
    });
    });
    }
      );
      };

function addDept(){
  inquirer
  .prompt([
    {
      type: "input",
      name: "deptName", 
      message: "What Department would you like to add?"
    }
  ])
  .then(function(res){
    console.log(res);
    const query = connection.query(
      "INSERT INTO departments SET ?", 
      {
        name: res.deptName
      }, 
      function(err, res){
        connection.query("SELECT * FROM departments", function(err, res){
          console.table(res); 
          start(); 
        })
      }
    )
  })
}

function viewAllDept(){
connection.query ("SELECT * FROM departments", function(err, res){
  console.table(res);
  start();
})
}

function addRole() {
  let departments= []; 
connection.query("SELECT * FROM departments",
function(err,res){
  if(err) throw err;
  for (let i=0; i <res.length; i++){
    res[i].first_name + " " + res[i].last_name
    departments.push({name: res[i].name, value: res[i].id});
  }
inquirer
.prompt([
  {
    type: "input", 
    name: "title",
    message: "What role would you like to add?"
  },
  {
    type: "input",
    name: "salary",
    message: "What is the salary for the role?"
  },
  {
    type: "list",
    name: "department",
    message: "what department?",
    choices: departments
  }
])
.then (function(res){
  console.log(res); 
  const query = connection.query(
    "INSERT INTO roles SET ?",
    {
      title: res.title,
      salary: res.salary,
      department_id: res.department
    }, 
    function (err, res){
      if (err) throw err;
      //const id = res.insertId;
      start(); 
    }
  )
})
})
}

function viewAllRoles(){
  connection.query("SELECT roles.*, departments.name FROM roles LEFT JOIN departments ON departments.id = roles.department_id", function (err,res){
    if (err) throw err;
    console.table(res);
    start();
  }
  )
  }

function updatestaffRole(){
​
connection.query("SELECT first_name, last_name, id FROM staff",
function(err,res){
  // for (let i=0; i <res.length; i++){
  //   staff.push(res[i].first_name + " " + res[i].last_name);
  // }
  let staff = res.map(staff => ({name: staff.first_name + " " + staff.last_name, value: staff.id}))
​
  inquirer
  .prompt([
    {
      type: "list",
      name: "staffName",
      message: "Which staff's role would you like to update?", 
      choices: staff
    },
    {
      type: "input",
      name: "role",
      message: "What is your new role?"
    }
  ])
  .then (function(res){
    connection.query(`UPDATE staff SET role_id = ${res.role} WHERE id = ${res.staffName}`,
    function (err, res){
      console.log(res);
      //updateRole(res);
      start()
    }
    );
  })
}
)
}
