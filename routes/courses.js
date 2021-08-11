const express = require("express");
const Joi = require("joi");
const router = express.Router();

// data
const courses = [
  { id: 1, course: "course 1" },
  { id: 2, course: "course 2" },
  { id: 3, course: "course 3" },
];

router.get("/", (req, res) => {
  res.send(courses);
});
router.get("/:id", (req, res) => {
  const course = courses.find((i) => i.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("Not found");
  res.send(course);
});

// POST method
router.post("/", (req, res) => {
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
router.put("/:id", (req, res) => {
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
router.patch("/:id", (req, res) => {
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
router.delete("/:id", (req, res) => {
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

module.exports = router;
