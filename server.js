require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dbConnection = require("./config/dbConfig");

const app = express();
const port = process.env.PORT || 5000;

// ✅ CORS Middleware: production-only origin
const allowedOrigins = ["https://evangadifront-npmu.vercel.app"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("🚫 Blocked by CORS:", origin);
        callback(null, false);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Handle preflight requests
app.options("*", cors());

// Parse JSON requests
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("Welcome to Evangadi API"));
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1", require("./routes/questionRoute"));
app.use("/api/v1", require("./routes/answerRoute"));

// Start server with DB check
async function start() {
  try {
    await dbConnection.execute("SELECT 'test'");
    console.log("✅ Database connected");
    app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
  } catch (err) {
    console.error("❌ Database error:", err.message);
    process.exit(1); // Stop server if DB fails
  }
}

start();
