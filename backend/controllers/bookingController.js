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
      updates: "Not-Accepted",
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
      updates: booking.updates,
      paymentStatus: booking.paymentStatus,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    }));

    res.status(200).json(formattedBookings);
  } catch (error) {
    console.error("Error retrieving bookings:", error);
    res.status(500).json({ error: "Failed to retrieve bookings" });
  }
};

// this api is used to show the list of bookings that driver has got before him accepting a booking
const getAvailableBookings = async (req, res) => {
  try {
    const driverUserId = req.userId; // Get user ID from the auth middleware

    // Check if the user's role is 'driver'
    if (req.role !== "driver") {
      return res
        .status(403)
        .json({ message: "Access denied. Only drivers are allowed." });
    }

    // Find the driver associated with the user ID
    const driver = await Driver.findOne({ user: driverUserId });

    if (!driver) {
      return res.status(404).json({ message: "Driver not found." });
    }

    const driverId = driver._id; // Extract the driver's ID

    // Fetch pending bookings for the specific driver
    const bookings = await Booking.find({
      driver: driverId,
      status: "pending", // Only fetch pending bookings
    });

    if (!bookings.length) {
      return res.status(404).json({ message: "No available bookings." });
    }

    res.status(200).json(bookings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching bookings", error: error.message });
  }
};

//this api is used to show the bookings that driver has which he has accepted
const currentBooking = async (req, res) => {
  try {
    const driverUserId = req.userId; // Get user ID from the auth middleware

    // Find the driver associated with the user ID
    const driver = await Driver.findOne({ user: driverUserId });

    if (!driver) {
      return res.status(404).json({ message: "Driver not found." });
    }
    const driverId = driver._id; // Extract the driver's ID

    // console.log(driverId);

    // Fetch in-progress bookings for the specific driver
    const booking = await Booking.find({
      driver: driverId,
      status: "in-progress", // Fetch only in-progress bookings
    });

    // console.log(driverId, booking);

    if (!booking.length) {
      return res.status(404).json({ message: "No in-progress bookings." });
    }

    res.status(200).json(booking); // Return the in-progress booking(s)
  } catch (error) {
    console.error("Error fetching current booking:", error);
    res.status(500).json({ error: "Error fetching current booking" });
  }
};

const completedBookings = async (req, res) => {
  try {
    // Get user ID from the auth middleware
    const driverUserId = req.userId;
    console.log("Received request for userId:", driverUserId); // Debug log

    // Find the driver associated with the user ID
    const driver = await Driver.findOne({ user: driverUserId });
    if (!driver) {
      console.log("No driver found for userId:", driverUserId); // Debug log
      return res.status(404).json({ message: "Driver not found." });
    }

    const driverId = driver._id; // Extract the driver's ID
    // console.log("Driver found with ID:", driverId); // Debug log

    const bookings = await Booking.find({
      driver: driverId,
      status: "completed",
    });
    // console.log("Completed bookings found:", bookings);

    // Check if there are no completed bookings
    if (!bookings.length) {
      return res.status(404).json({ message: "No completed bookings found." });
    }

    // Return the list of completed bookings
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching completed bookings:", error); // Log the error
    res
      .status(500)
      .json({ error: "Server error while fetching completed bookings." });
  }
};

const paymentSection = async (req, res) => {
  const { bookingId } = req.params;
  console.log(req.userId);
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log(booking.status);

    if (booking.paymentStatus === "pending") {
      booking.paymentStatus = "paid";
      await booking.save();
      return res.json({ message: "Payment successful", booking });
    } else {
      return res
        .status(400)
        .json({ message: "Booking already paid or completed" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error processing payment", error });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  currentBooking,
  getAvailableBookings,
  completedBookings,
  paymentSection,
};
