// auth.js (middleware)
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Assuming your User model is in this file

// Middleware to verify if the user is an admin
const verifyAdmin = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT secret here
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to access this resource." });
    }

    req.user = user; // Attach user info to the request object
    next();
  } catch (error) {
    console.error("Error verifying admin:", error);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = { verifyAdmin };
