// Import required modules
const express = require("express");

const {
  driverRequestsforAdmin,
  approveOrRejectDriverRequest,
  DeleteDriver,
  DeleteVehicle,
} = require("../controllers/adminController");

const router = express.Router();

// Route to fetch all driver requests for admin
router.get("/driver-requests", driverRequestsforAdmin);

// Route to approve or reject a driver request
router.patch("/approve-driver-request/:driverId", approveOrRejectDriverRequest);

//to delete the driver
router.delete("/delete-driver/:driverId", DeleteDriver);

router.delete("/delete-vehicle/:vehicleId", DeleteVehicle);

module.exports = router;