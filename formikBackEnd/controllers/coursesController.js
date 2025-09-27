const Course = require("../models/courses");
exports.addCourse = async (req, res) => {
  try {
    const { courseName, courseCode, creditHour } = req.body;

    const studentId = req.user.id;

    const newCourse = new Course({
      courseName,
      courseCode,
      creditHour,
      student: studentId,
    });

    await newCourse.save();

    res
      .status(201)
      .json({ message: "course added successfully", course: newCourse });
  } catch (error) {
    res.status(500).json({ message: "server error while adding the course" });
  }
};

// get all the courses for student logedin student

exports.fetchCourse = async (req, res) => {
  try {
    const studentId = req.user.id;
    const courses = await Course.find({ student: studentId });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// update the course

exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user.id;
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: "course not found" });
    }
    if (course.student.toString() !== studentId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { courseName, courseCode, creditHour } = req.body;

    course.courseName = courseName;
    course.courseCode = courseCode;
    course.creditHour = creditHour;

    await course.save();
    res.status(200).json({ message: "Course updated successfully", course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// delete course

exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user.id;

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (course.student.toString() !== studentId)
      return res.status(403).json({ message: "Unauthorized" });

    await course.deleteOne();
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
