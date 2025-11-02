// dbConfig.js
const mysql2 = require("mysql2");
const path = require("path");
const dotenv = require("dotenv");

// Load local .env file only in development
if (process.env.NODE_ENV !== "production") {
  dotenv.config({
    path: path.resolve(__dirname, "../.env.development"),
  });
} else {
  // In production (Render), environment variables are already set
  dotenv.config(); // optional, safe to leave
}

// Build database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 3306,

  connectionLimit: process.env.DB_CONNECTION_LIMIT || 10,
};

// Optional SSL if needed (set DB_SSL=true and DB_SSL_CA path in .env.production)
if (process.env.DB_SSL === "true") {
  dbConfig.ssl = {
    rejectUnauthorized: true,
    ca: process.env.DB_SSL_CA,
  };
}

// Create a pool
const dbConnection = mysql2.createPool(dbConfig);

// Test the connection once at startup
dbConnection.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Database connected successfully");
    connection.release();
  }
});

// Export promise-based pool for async/await
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
