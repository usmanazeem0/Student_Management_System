const express = require("express");
const router = express.Router();
const {
  addCourse,
  fetchCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/coursesController");

const studentAuth = require("../middlewares/student.auth");

router.post("/addCourse", studentAuth, addCourse);
router.get("/my-courses", studentAuth, fetchCourse);
router.put("/:id", studentAuth, updateCourse);
router.delete("/:id", studentAuth, deleteCourse);

module.exports = router;
