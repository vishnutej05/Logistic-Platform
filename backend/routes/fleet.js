// const express = require("express");
// const router = express.Router();
// const authMiddleware = require("../middleware/userauth");
// const Driver = require("../models/Driver");

// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     // Add admin check if needed
//     if (!req.user.isAdmin) {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     const drivers = await Driver.find().populate("vehicle");
//     res.json(drivers);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

// module.exports = router;

const express = require("express");
const { getAnalytics } = require("../controllers/adminController");
const router = express.Router();

// Analytics route for admins
router.get("/analytics", getAnalytics);

module.exports = router;
