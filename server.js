


console.log("Server starting...");
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const authMiddleware = require("./middleware/authMiddleware");

const port = process.env.PORT || 5173;

// Optional DB connection
let dbConnection;
try {
  dbConnection = require("./config/dbConfig");
} catch (err) {
  console.log("⚠️ Database connection skipped (no DB deployed)");
}

// ✅ Fixed CORS: allow localhost and any other origins (Render safe)
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local dev
      "https://evangadi-frontend.vercel.app", // (optional) deployed frontend later
      "*", // fallback to allow all
    ],
    credentials: true,
  })
);

// JSON middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.status(200).send("Welcome to Evangadi Backend!");
});

app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1", require("./routes/questionRoute"));
app.use("/api/v1", require("./routes/answerRoute"));

// Start server
app.listen(port, () => {
  console.log(`✅ Server running and listening on port ${port}`);
});

// console.log("Server starting...");
// require("dotenv").config();
// const express = require("express");
// const app = express();
// const cors = require("cors");
// const authMiddleware = require("./middleware/authMiddleware");

// const port = process.env.PORT || 5000;

// // Optional DB connection
// let dbConnection;
// try {
//   dbConnection = require("./config/dbConfig");
// } catch (err) {
//   console.log("⚠️ Database connection skipped (no DB deployed)");
// }

// // CORS
// app.use(
//   cors({
//     origin: ["http://localhost:5173"],
//     credentials: true,
//   })
// );

// // JSON middleware
// app.use(express.json());

// // Routes
// app.get("/", (req, res) => {
//   res.status(200).send("Welcome to Evangadi Backend!");
// });

// app.use("/api/v1/user", require("./routes/userRoutes"));
// app.use("/api/v1", require("./routes/questionRoute"));
// app.use("/api/v1", require("./routes/answerRoute"));

// // Start server
// app.listen(port, () => {
//   console.log(`✅ Server running and listening on port ${port}`);
// });

// / require("dotenv").config();

// const express = require("express");
// const app = express();
// const authMiddleware = require("./middleware/authMiddleware");
// const cors = require("cors");

// const port = process.env.PORT || 5000;

// //db connection
// const dbConnection = require("./config/dbConfig");

// // test get request
// app.get("/", (req, res) => {
//   res.status(200).send("welcome-to Evangadi-");
// });
// //cors middleware
// app.use(
//   cors({
//     origin: ["http://localhost:5173"],
//     credentials: true,
//   })
// );

// //json middleware
// app.use(express.json());

// // user routes middleware file import
// const userRoutes = require("./routes/userRoutes");

// // user routes middleware
// app.use("/api/v1/user", userRoutes);

// // questions routes middleware file import
// const questionRoutes = require("./routes/questionRoute");
// // questions routes middleware
// app.use("/api/v1", questionRoutes);
// // answers routes middleware file import
// const answerRoutes = require("./routes/answerRoute");

// // answers routes middleware
// app.use("/api/v1", answerRoutes);

// async function start() {
//   try {
//     const result = await dbConnection.execute("select 'test'");
//     console.log("Your database is connected sucessfully ");
//     await app.listen(port);
//     console.log(`server running and listening on port ${port}`);
//   } catch (err) {
//     console.log(err.message);
//   }
// }

// start();
