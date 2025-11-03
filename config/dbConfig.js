// dbConfig.js
const mysql2 = require("mysql2");

// Build database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  connectionLimit: process.env.DB_CONNECTION_LIMIT
    ? parseInt(process.env.DB_CONNECTION_LIMIT, 10)
    : 2,
};

// Optional SSL (if required by your production DB)
if (process.env.DB_SSL === "true") {
  dbConfig.ssl = {
    rejectUnauthorized: true,
    ca: process.env.DB_SSL_CA,
  };
}

// Create a connection pool
const dbPool = mysql2.createPool(dbConfig);

// Test connection at startup
dbPool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1); // Stop app if DB connection fails
  } else {
    console.log("✅ Database connected successfully");
    connection.release();
  }
});

// Export promise-based pool for async/await
module.exports = dbPool.promise();
