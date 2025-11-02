const mysql2 = require("mysql2");
const path = require("path");

// Load correct .env file based on NODE_ENV
require("dotenv").config({
  path:
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "../.env.production")
      : path.resolve(__dirname, "../.env.development"),
});

// Build database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  connectionLimit: process.env.DB_CONNECTION_LIMIT || 10,
};

// Optional SSL configuration for production DBs
if (process.env.DB_SSL === "true") {
  dbConfig.ssl = {
    rejectUnauthorized: true,
    ca: process.env.DB_SSL_CA, // path to CA cert
  };
}

// Create the pool
const dbConnection = mysql2.createPool(dbConfig);

// Test the connection
dbConnection.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Database connected successfully");
    connection.release();
  }
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
