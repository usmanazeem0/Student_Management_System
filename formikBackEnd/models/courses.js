const mongoose = require("mongoose");
const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
  },
  courseCode: {
    type: Number,
    required: true,
  },
  creditHour: {
    type: Number,
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
});

module.exports = mongoose.model("Course", courseSchema);
