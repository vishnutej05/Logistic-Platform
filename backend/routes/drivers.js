const express = require("express");
const {
  createDriver,
  driversList,
  getAvailableBookings,
  acceptBooking,
  currentBooking,
  driverDetails,
} = require("../controllers/driverController");
const router = express.Router();

//Create a new driver
router.post("/create", createDriver);

//list of drivers
router.get("/", driversList);

//to show available bookings for drivers
router.get("/available-bookings", getAvailableBookings);

//to accept bookings
router.post("/accept-booking/:bookingId", acceptBooking);

//to show current bookings
router.get("/current-bookings/", currentBooking);

router.get("/details", driverDetails);

module.exports = router;
