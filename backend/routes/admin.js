// Import required modules
const express = require("express");

const {
  driverRequestsforAdmin,
  approveOrRejectDriverRequest,
} = require("../controllers/adminController");

const router = express.Router();

// Route to fetch all driver requests for admin
router.get("/driver-requests", driverRequestsforAdmin);

// Route to approve or reject a driver request
router.patch("/approve-driver-request/:driverId", approveOrRejectDriverRequest);

module.exports = router;
