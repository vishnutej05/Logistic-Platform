const express = require("express");
const {
  createBooking,
  getUserBookings,
} = require("../controllers/bookingController");

const router = express.Router();

// Create a new booking
router.post("/", createBooking);

// Get all bookings for a user
router.get("/", getUserBookings);

module.exports = router;
