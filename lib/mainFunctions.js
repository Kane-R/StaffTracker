// Add NEW STAFF MEMBER
const mainFunctions = {
  addStaff: async function (conn, firstname, lastname, roleID, managerID) {
    return new Promise((resolve, reject) => {
      const qrytext = `insert into staff set ?`;
      const newStaff = {
        first_name: firstname,
        last_name: lastname,
        role_id: roleID,
        manager_id: managerID,
      };
      //console.log(qrytext);
      conn.query(qrytext, newStaff, function (err, res) {
        if (err) throw err;
        else console.log("New staff successfully saved.");
        resolve(true);
      });
    });
  },

  // Add NEW DEPARTMENT
  addDept: async function (conn, dept) {
    return new Promise((resolve, reject) => {
      const qrytext = `insert into department set ?`;
      const newdata = { name: dept };
      //console.log(qrytext);
      conn.query(qrytext, newdata, function (err, res) {
        if (err) throw err;
        else console.log("New department successfully added.");
        resolve(true);
      });
    });
  },

  // Add NEW ROLE
  addRole: async function (conn, role_name, salary, dept_id) {
    return new Promise((resolve, reject) => {
      const qrytext = `insert into role set ?`;
      const newdata = {
        title: role_name,
        salary: salary,
        department_id: dept_id,
      };
      //console.log(qrytext);
      conn.query(qrytext, newdata, function (err, res) {
        if (err) throw err;
        else console.log("New role successfully added.");
        resolve(true);
      });
    });
  },

  //   get ALL STAFF
  getAllStaffData: async function (conn) {
    return new Promise((resolve, reject) => {
      const qrytext = `select * from v_allStaff`;
      conn.query(qrytext, function (err, res) {
        if (err) throw err;
        //console.log(res);
        else resolve(res);
      });
    });
  },

  //  get ALL ROLES
  getRoles: async function (conn) {
    return new Promise((resolve, reject) => {
      const qrytext = `select * from v_roles`;
      conn.query(qrytext, function (err, res) {
        if (err) {
          reject(err);
        } else {
          //console.log(res);
          let title = res.map((row) => {
            return `${row.title}`;
          });
          let ids = res.map((row) => row.role_id);
          //console.log({names,ids});
          resolve({ title, ids });
        }
      });
    });
  },

  //   get All MANAGERS
  getManagers: async function (conn) {
    return new Promise((resolve, reject) => {
      const qrytext = `select * from v_allmanagers`;
      conn.query(qrytext, function (err, res) {
        if (err) {
          reject(err);
        } else {
          //console.log(res);
          let names = res.map((row) => {
            return `${row.Name} - ${row.title}`;
          });
          let ids = res.map((row) => row.id);
          //console.log({names,ids});
          resolve({ names, ids });
        }
      });
    });
  },

  //   get ALL DEPARTMENTS
  getDepartments: async function (conn) {
    return new Promise((resolve, reject) => {
      const qrytext = `select * from department`;
      conn.query(qrytext, function (err, res) {
        if (err) {
          reject(err);
        } else {
          //console.log(res);
          let names = res.map((row) => row.name);
          let ids = res.map((row) => row.id);

          //console.log({names,ids});
          resolve({ names, ids });
        }
      });
    });
  },

  //   display ALL DEPARTMENTS
  showDepts: async function (conn) {
    return new Promise((resolve, reject) => {
      const qrytext = `select name from department order by name`;
      conn.query(qrytext, function (err, res) {
        if (err) {
          reject(err);
        } else {
          //console.log(res);
          resolve(res);
        }
      });
    });
  },

  //   display ALL ROLES
  showRoles: async function (conn) {
    return new Promise((resolve, reject) => {
      const qrytext = `select title,salary,Department_name from v_roles order by Department_name,salary,title`;
      conn.query(qrytext, function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },

  //   update STAFF ROLE ID
  updateStaffRole: async function (conn, updateID, newRoleID) {
    return new Promise((resolve, reject) => {
      const qrytext = `update staff set role_id= ? where id = ?`;
      const filldata = [newRoleID, updateID];
      conn.query(qrytext, filldata, function (err, res) {
        //console.log(res);
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },

  //   get ALL SALARIES from department table
  getSalariesTotal: async function (conn, updateID, newRoleID) {
    return new Promise((resolve, reject) => {
      const qrytext = `select * from v_salariesByDept`;
      conn.query(qrytext, function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },

  viewStaffByManager: async function (conn, updateID, newRoleID) {
    return new Promise((resolve, reject) => {
      const qrytext = `select * from v_staffByManager`;
      conn.query(qrytext, function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },

  getStaffApp: async function (conn, firstname, lastname, rolename) {
    return new Promise((resolve, reject) => {
      const qrytext = `select * from v_staffWithIDs where (first_name=? and last_name=
            ? and title = ?)`;
      const newdata = [firstname, lastname, rolename];
      //const newdata = [first_name=firstname,last_name=lastname,title=rolename];
      conn.query(qrytext, newdata, function (err, res) {
        //console.log({res});
        if (err) {
          reject(err);
        } else {
          const staffID = res[0].id;
          const roleID = res[0].role_id;
          resolve({ staffID, roleID });
        }
      });
    });
  },
};

module.exports = mainFunctions;
