const express = require("express");
const config = require("config");
const morgan = require("morgan");
const helmet = require("helmet");
const Joi = require("joi");
const logger = require("./middlewares/logger");
const authenticator = require("./middlewares/authenticator");

// debug
const startupDebugger = require('debug')('app:startup')
const dbDebugger = require('debug')('app:db')
dbDebugger('Connected to database...')
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

// data
const courses = [
  { id: 1, course: "course 1" },
  { id: 2, course: "course 2" },
  { id: 3, course: "course 3" },
];

// GET method
app.get("/", (req, res) => {
  res.send("welcome home");
});
app.get("/api/courses", (req, res) => {
  res.send(courses);
});
app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((i) => i.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("Not found");
  res.send(course);
});

// POST method
app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const course = { id: courses.length + 1, name: req.body.course };
  courses.push(course);
  res.send(course); // convention to send back
});

// PUT method
app.put("/api/courses/:id", (req, res) => {
  const course = courses.find((i) => i.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("item not found");
    return;
  }

  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  course.course = req.body.course;
  res.send(course);
});

// PATCH method
app.patch("/api/courses/:id", (req, res) => {
  const course = courses.find((i) => i.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("item not found");
    return;
  }

  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  course.course = req.body.course;
  res.send(course);
});

// DELETE method
app.delete("/api/courses/:id", (req, res) => {
  const course = courses.find((i) => i.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("item not found");

  // deleting
  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);
});

// funcitons
function validateCourse(course) {
  const schema = {
    course: Joi.string().min(3).required(),
  };
  return Joi.validate(course, schema);
}

app.listen(3000, () => console.log("http://localhost:3000"));
