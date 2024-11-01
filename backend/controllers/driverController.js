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

// Driver accepts booking
const acceptBooking = async (req, res) => {
  try {
    if (req.role !== "driver") {
      return res
        .status(403)
        .json({ message: "Access denied. Only drivers can accept booking." });
    }
    const { bookingId } = req.params;
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
    booking.updates = "Accepted";
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

const startRide = async (req, res) => {
  try {
    if (req.role !== "driver") {
      return res.status(403).json({
        message: "Access denied. Only drivers can change booking updates.",
      });
    }

    const { bookingId } = req.params;

    console.log(bookingId);
    const booking = await Booking.findById(bookingId);
    if (!booking || booking.updates === "Started") {
      return res.status(400).json("Ride has already started");
    }

    booking.updates = "Started";
    booking.status = "in-progress";
    await booking.save();
    res.status(200).json("Ride has started");
  } catch (error) {
    console.error("Error fetching booking details:", error);
    return res.status(500).json({ error: "Failed to change booking updates." });
  }
};

const endRide = async (req, res) => {
  try {
    const driverUserId = req.userId;
    // console.log("Driver Id ", driverUserId);

    if (req.role !== "driver") {
      return res.status(403).json({
        message: "Access denied. Only drivers can change booking updates.",
      });
    }

    const { bookingId } = req.params;

    const driver = await Driver.find({ user: driverUserId });
    if (!driver) {
      return res.status(400).json({ message: "Driver not found." });
    }
    driver[0].level++;
    // console.log("Driver ", driver[0].level);
    // console.log(bookingId);
    const booking = await Booking.findById(bookingId);
    if (!booking || booking.updates === "Delivered") {
      return res.status(400).json("Ride has already Ended");
    }

    booking.updates = "Delivered";
    booking.status = "completed";
    await booking.save();
    res.status(200).json("Ride has ended");
  } catch (error) {
    console.error("Error fetching booking details:", error);
    return res.status(500).json({ error: "Failed to change booking updates." });
  }
};

module.exports = {
  createDriver,
  driversList,
  acceptBooking,
  driverDetails,
  startRide,
  endRide,
};
