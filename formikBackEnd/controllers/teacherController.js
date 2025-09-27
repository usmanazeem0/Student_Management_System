const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Teacher = require("../models/user");
const Student = require("../models/students");

exports.teacherSignup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await Teacher.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new Teacher({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.teacherLogin = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let user;
    if (role === "teacher") {
      user = await Teacher.findOne({ email });
    } else if (role === "student") {
      user = await Student.findOne({ email });
    } else {
      return res.status(400).json({ message: "Role is required" });
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Successful Login",
      token,
      user: { id: user._id, email: user.email, role },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
