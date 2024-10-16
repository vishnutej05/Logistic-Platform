const express = require("express");
const {
  createDriver,
  driversList,
} = require("../controllers/driverController");
const router = express.Router();

//Create a new driver
router.post("/create", createDriver);

// Not needed because while creating a driver we will assign a vehicle to the driver
// router.post("/assign-vehicle", assignVehicle);

router.get("/", driversList);

// router.delete("/", deleteDriver);

module.exports = router;
