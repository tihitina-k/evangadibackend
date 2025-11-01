
const mysql2 = require("mysql2");
// const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

const dbConnection = mysql2.createPool({
  host: process.env.DB_HOST, 
  port: process.env.DB_PORT, 
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  connectionLimit:20,
  //   process.env.CONNECTION_LIMIT || process.env.DB_CONNECTION_LIMIT,
  // ssl: {
  //   ca: fs.readFileSync(process.env.DB_SSL_CA), // path to ca.pem
  // },
});

module.exports = dbConnection.promise();




// const mysql2 = require("mysql2");
// const dotenv = require("dotenv");
// dotenv.config();

// const dbConnection = mysql2.createPool({
//   user: process.env.DB_USER,
//   database: process.env.DB_DATABASE,
//   password: process.env.DB_PASS,
//   connectionLimit:
//     process.env.CONNECTION_LIMIT || process.env.DB_CONNECTION_LIMIT,
//   host: process.env.DB_HOST,
// });

// module.exports = dbConnection.promise();
