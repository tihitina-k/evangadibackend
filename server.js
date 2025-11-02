require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dbConnection = require("./config/dbConfig");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://evangadifront.vercel.app"]
    : ["http://localhost:5173"];

app.use(express.json());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Routes
app.get("/", (req, res) => res.send("Welcome to Evangadi API"));
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1", require("./routes/questionRoute"));
app.use("/api/v1", require("./routes/answerRoute"));

// Start server
async function start() {
  try {
    await dbConnection.execute("SELECT 'test'");
    console.log("✅ Database connected");
    app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
  } catch (err) {
    console.error("❌ Database error:", err.message);
    process.exit(1);
  }
}
start();
