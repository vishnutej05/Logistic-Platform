const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");
const estimatePrice = require("../utils/priceEstimator"); // Import price estimator

// Book a vehicle for transport
const createBooking = async (req, res) => {
  try {
    const { vehicleId, pickupLocation, dropoffLocation, distance } = req.body;

    // Find the vehicle and check if it's available
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res
        .status(404)
        .json({ error: "Vehicle not found enter correct vehicle id" });
    }

    if (!vehicle.availability) {
      return res.status(400).json({ error: "Vehicle is not available" });
    }

    // Estimate the price based on vehicle type and distance
    const price = estimatePrice(vehicle.type, distance);

    // Create a new booking
    const booking = new Booking({
      user: req.userId, // Assume userId comes from authenticated user middleware
      vehicle: vehicleId,
      pickupLocation,
      dropoffLocation,
      price, // Set the calculated price
      distance,
      status: "pending",
    });

    // Save booking to the database
    await booking.save();

    // Mark vehicle as unavailable for future bookings
    vehicle.availability = false;
    await vehicle.save();

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating booking" });
  }
};

// Get all bookings for the current user
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId }).populate(
      "vehicle"
    );
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve bookings" });
  }
};

module.exports = { createBooking, getUserBookings };
