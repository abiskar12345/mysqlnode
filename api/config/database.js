const { createPool } = require("mysql");

const pool = createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

// pool.getConnection(function(err){
//   if(err) console.log(err);
// })

console.log("Create database");
console.log(process.env.MYSQL_DATABASE)


module.exports = pool;
