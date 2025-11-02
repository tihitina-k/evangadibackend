require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dbConnection = require("./config/dbConfig");

const app = express();
const port = process.env.PORT || 5000;

// Middleware: CORS
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://evangadifront-npmu.vercel.app"]
    : ["http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman or server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true); // allow this origin
      } else {
        callback(new Error("Not allowed by CORS")); // reject other origins
      }
    },
    credentials: true,
  })
);

// Middleware: parse JSON
app.use(express.json());

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
