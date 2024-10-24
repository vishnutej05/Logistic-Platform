const Driver = require("../models/Driver"); // Import the Driver model
const Booking = require("../models/Booking"); // Import the Booking

const createDriver = async (req, res) => {
  const { name, licenseNumber, phone, status } = req.body;
  const userId = req.userId; // Extract userId from request

  // Check for required fields
  if (!name || !licenseNumber || !phone || !status) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Optional: Check if the status is valid
  const validStatuses = ["available", "busy"];
  if (!validStatuses.includes(status)) {
    return res
      .status(400)
      .json({ message: "Invalid status. Must be 'available' or 'busy'." });
  }

  try {
    // Check if the driver already exists by name, licenseNumber, or phone
    const existingDriver = await Driver.findOne({
      $or: [{ name }, { licenseNumber }, { phone }],
    });

    if (existingDriver) {
      return res.status(400).json({
        message:
          "Driver with the same name, license number, or phone already exists.",
      });
    }

    // Create a new driver
    const newDriver = new Driver({
      name,
      user: userId, // Use 'user' instead of 'userId'
      licenseNumber,
      phone,
      status,
    });

    // Save the new driver
    await newDriver.save();
    res
      .status(201)
      .json({ message: "Driver created successfully", driver: newDriver });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating driver", error: error.message });
  }
};

const driversList = async (req, res) => {
  try {
    const driver = await Driver.find().populate("vehicle");
    res.status(201).json(driver);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating driver", error: error.message });
  }
};

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

const currentBooking = async (req, res) => {
  try {
    const driverUserId = req.userId; // Get user ID from the auth middleware

    // Find the driver associated with the user ID
    const driver = await Driver.findOne({ user: driverUserId });

    if (!driver) {
      return res.status(404).json({ message: "Driver not found." });
    }
    const driverId = driver._id; // Extract the driver's ID

    console.log(driverId);

    // Fetch in-progress bookings for the specific driver
    const booking = await Booking.find({
      driver: driverId,
      status: "in-progress", // Fetch only in-progress bookings
    });

    console.log(driverId, booking);

    if (!booking.length) {
      return res.status(404).json({ message: "No in-progress bookings." });
    }

    res.status(200).json(booking); // Return the in-progress booking(s)
  } catch (error) {
    console.error("Error fetching current booking:", error);
    res.status(500).json({ error: "Error fetching current booking" });
  }
};

// Driver accepts booking
const acceptBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const driverId = req.userId; // Extract driverId from the request (through middleware)

    if (req.role !== "driver") {
      return res
        .status(403)
        .json({ message: "Access denied. Only drivers can accept booking." });
    }

    // Check if booking is still available
    const booking = await Booking.findById(bookingId);
    if (!booking || booking.status !== "pending") {
      return res.status(400).json({
        error:
          "Booking is no longer available, some other driver might have accepted the booking!",
      });
    }

    // Mark booking as in-progress and assign driver
    booking.status = "in-progress";
    // booking.driver = driverId;
    await booking.save();

    res.status(200).json({ message: "Booking accepted", booking });
  } catch (error) {
    res.status(500).json({ error: "Failed to accept booking" });
  }
};

const driverDetails = async (req, res) => {
  try {
    const driverUserId = req.userId;
    const driver = await Driver.findOne({ user: driverUserId });
    if (!driver) {
      return res.status(404).json({ message: "Driver not found." });
    }
    // console.log(driver);
    res.status(200).json(driver);
  } catch (e) {
    console.error("Error fetching driver details:", e);
    return res.status(500).json({ error: "Failed to fetch driver details." });
  }
};

module.exports = {
  createDriver,
  driversList,
  getAvailableBookings,
  acceptBooking,
  currentBooking,
  driverDetails,
};
