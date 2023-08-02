const app = require("./app");
const path = require("path");
const connectDatabase = require("./db/Database");

// Handling Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting Down the server for handling uncaught exception`);
});

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  var envPath = path.join(__dirname, "./config/.env");
}

require("dotenv").config({
  path: envPath,
});

// connectDatabase
connectDatabase();

// server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

// unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Shutting Down the server for ${err.message}`);
  console.log(`Shutting Down the server for unhandled promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});
