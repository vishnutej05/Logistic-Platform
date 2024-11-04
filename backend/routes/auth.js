const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET || "your_secret_key"; // Use environment variable

const User = require("../models/User");
const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check for required fields
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check for required fields
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password); // Use await
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token including user ID and role
    const token = jwt.sign({ userId: user._id, role: user.role }, secretKey, {
      expiresIn: "12h",
    });

    // Send back the token and user role
    res.status(200).json({ token, role: user.role }); // Corrected to include role in response
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


router.get("/", async (req, res) => {
  res.send("Welcome");
});

module.exports = router;
