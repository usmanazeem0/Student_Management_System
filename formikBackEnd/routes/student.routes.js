const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const teacherMiddleWare = require("../middlewares/teacher.auth");

router.post("/add", teacherMiddleWare, studentController.studentAdd);
router.get("/my-students", teacherMiddleWare, studentController.fetchStudent);
router.delete("/:id", teacherMiddleWare, studentController.deleteStudent);
router.put("/:id", teacherMiddleWare, studentController.updateStudent);

module.exports = router;
