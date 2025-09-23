const Student = require("../models/students");
const generateRandomPassword = require("../utils/generatePassword");
const sendEmail = require("../utils/sendEmail");
exports.studentAdd = async (req, res) => {
  try {
    const { name, email, course, teacherEmail, dob } = req.body;

    // prevent duplicate student with same email

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res
        .status(400)
        .json({ message: "student with this email already exists" });
    }

    const randomPassword = generateRandomPassword(8);

    // else create new student

    const newStudent = new Student({
      name,
      email,
      course,
      dob,
      teacher: req.user.id,
    });
    await newStudent.save();

    // send email to student
    try {
      await sendEmail({
        to: email,
        subject: "Your Account Password",
        text: `Hello ${name},\n\nYour account has been created.\nYour password: ${randomPassword}\n\nPlease change it after login.`,
      });
      console.log(" Email sent to:", email);
    } catch (emailError) {
      console.error(" Email sending failed:", emailError.message);
    }

    res
      .status(201)
      .json({ message: "student saved successfully", student: newStudent });
  } catch (error) {
    res.status(500).json({ message: "error saving student" });
  }
};

// fetch students for logged-in teacher

exports.fetchStudent = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const students = await Student.find({ teacher: req.user.id });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error });
  }
};

//delete student
exports.deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete({
      _id: req.params.id,
      teacher: req.user.id,
    });
    res.json({ message: "student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "error while deleting student" });
  }
};

//update student

exports.updateStudent = async (req, res) => {
  try {
    const { name, course, dob } = req.body;
    const updatedStudent = await Student.findByIdAndUpdate(
      { _id: req.params.id, teacher: req.user.id }, //  check teacher ownership
      { name, course, dob },
      { new: true }
    );
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: "error while updating student" });
  }
};
