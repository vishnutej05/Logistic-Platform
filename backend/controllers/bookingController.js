const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver"); // Assuming you have a Driver mode
const estimatePrice = require("../utils/priceEstimator");

const createBooking = async (req, res) => {
  try {
    const { vehicleId, pickupLocation, dropoffLocation, distance, driverId } =
      req.body;
    // Find the vehicle
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    // Ensure vehicle is available
    if (!vehicle.availability) {
      return res.status(400).json({ error: "Vehicle is not available" });
    }

    // Find the driver
    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    if (driver.status !== "available") {
      return res.status(400).json({ error: "Driver is not available" });
    }

    // Estimate the price
    const price = estimatePrice(vehicle.type, distance);

    // Create a new booking
    const booking = new Booking({
      user: req.userId,
      vehicle: vehicleId,
      driver: driverId,
      pickupLocation,
      dropoffLocation,
      price,
      distance,
      status: "pending",
    });

    await booking.save();

    // Mark vehicle as unavailable and assign the driver
    vehicle.availability = false;
    vehicle.driver = driverId;
    await vehicle.save();

    driver.status = "busy";
    driver.vehicle = vehicleId;
    await driver.save();

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating booking" });
  }
};

// Get all bookings for the current user
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId })
      .populate("driver") // Populate driver details
      .populate("vehicle") // Populate vehicle details if needed
      .select(
        "pickupLocation dropoffLocation user vehicle driver status price distance createdAt updatedAt"
      ) // Only select necessary fields
      .lean(); // Use lean for better performance

    // Format the response to match the desired structure
    const formattedBookings = bookings.map((booking) => ({
      pickupLocation: {
        coordinates: {
          lat: booking.pickupLocation.coordinates.lat,
          lng: booking.pickupLocation.coordinates.lng,
        },
        address: booking.pickupLocation.address,
      },
      dropoffLocation: {
        coordinates: {
          lat: booking.dropoffLocation.coordinates.lat,
          lng: booking.dropoffLocation.coordinates.lng,
        },
        address: booking.dropoffLocation.address,
      },
      _id: booking._id,
      user: booking.user,
      vehicle: booking.vehicle,
      driver: booking.driver,
      status: booking.status,
      price: booking.price,
      distance: booking.distance,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    }));

    res.status(200).json(formattedBookings);
  } catch (error) {
    console.error("Error retrieving bookings:", error);
    res.status(500).json({ error: "Failed to retrieve bookings" });
  }
};

module.exports = { createBooking, getUserBookings };
