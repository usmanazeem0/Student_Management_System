const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.teacherSignup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // now check if user exists

    const existingUser = await User.findOne({ email });

    // check the condition for user
    if (existingUser) {
      return res.status(400).json({ message: "email already exists" });
    }

    // now, convert the plain password to hashPassword

    const hashPassword = await bcrypt.hash(password, 10);

    //create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "user register successfully" });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

exports.teacherLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    //check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    // compare the password with the has password

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Email or passeord" });
    }

    // generate json web token

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("this is token========", token);

    //success
    res.status(200).json({
      message: "Successfull Login",
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};
