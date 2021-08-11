const express = require("express");
const config = require("config");
const morgan = require("morgan");
const helmet = require("helmet");
const logger = require("./middlewares/logger");
const authenticator = require("./middlewares/authenticator");
const courses = require("./routes/courses");
const home = require("./routes/home");

// debug
const startupDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");
dbDebugger("Connected to database...");
// initialisation
const app = express();

// Environment setting
console.log(process.env.NODE_ENV); // undefined
console.log(app.get("env")); // development

// Configuration setting
console.log("Application Name: " + config.get("name"));
console.log("Mail server: " + config.get("mail.host"));
console.log("password: " + config.get("mail.password"));

// adding middleware
app.use(express.json());
app.use(helmet());
// setting morgan in dev env
if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  startupDebugger("Morgan enabled...");
}
// custom middleware
app.use(logger);
app.use(authenticator.auth);
app.use("/api/courses", courses);
app.use("/",home)

app.listen(3000, () => console.log("http://localhost:3000"));
