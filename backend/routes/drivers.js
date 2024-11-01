const express = require("express");
const {
  createDriver,
  driversList,
  acceptBooking,
  driverDetails,
  startRide,
  endRide,
} = require("../controllers/driverController");
const router = express.Router();

//Create a new driver
router.post("/create", createDriver);

//list of drivers
router.get("/", driversList);

//to accept bookings
router.post("/accept-booking/:bookingId", acceptBooking);

//to start the ride
router.post("/start-ride/:bookingId", startRide);

//to end the ride
router.post("/end-ride/:bookingId", endRide);

router.get("/details", driverDetails);

module.exports = router;
