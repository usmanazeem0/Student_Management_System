const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 3 },
  email: { type: String, required: true, unique: true },
  course: { type: String, required: true, minLength: 3 },
  dob: { type: Date, required: true }, // Date of birth
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Teacher who created
});

module.exports = mongoose.model("Student", studentSchema);
