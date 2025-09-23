const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

// require the user model here
const User = require("../models/user");
const teacherController = require("../controllers/teacherController");

// define the signup router

router.post("/signup", teacherController.teacherSignup);

router.post("/login", teacherController.teacherLogin);

module.exports = router;
