const express = require("express");
const {
  createBooking,
  getUserBookings,
  currentBooking,
  getAvailableBookings,
  completedBookings,
} = require("../controllers/bookingController");

const router = express.Router();

// Create a new booking
router.post("/", createBooking);

// Get all bookings for a user
router.get("/", getUserBookings);

//to show current bookings
router.get("/current-bookings/", currentBooking);

//to show available bookings for drivers
router.get("/available-bookings", getAvailableBookings);

//to show completed bookings
router.get("/completed-bookings", completedBookings);

module.exports = router;
