const Booking = require("../models/Booking");
const Driver = require("../models/Driver");
const Vehicle = require("../models/Vehicle");

const getAnalytics = async (req, res) => {
  try {
    const totalTrips = await Booking.countDocuments({});
    const activeDrivers = await Driver.countDocuments({ status: "available" });

    res.status(200).json({
      totalTrips,
      activeDrivers,
    });
  } catch (error) {
    res.status(500).json({ error: "Analytics fetch failed" });
  }
};

const driverRequestsforAdmin = async (req, res) => {
  try {
    // Fetch all driver requests with required fields, using the correct field 'requestStatus'
    const driverRequests = await Driver.find({ requestStatus: "pending" })
      .select("name licenseNumber phone createdAt")
      .exec();

    // console.log(req.user);

    if (driverRequests.length === 0) {
      return res.status(200).json({ message: "No driver requests available." });
    }

    res.status(200).json(driverRequests);
  } catch (error) {
    console.error("Error fetching driver requests:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

const approveOrRejectDriverRequest = async (req, res) => {
  const { driverId } = req.params;
  const { action } = req.body; // action can be 'approve' or 'reject'

  if (!["approve", "reject"].includes(action)) {
    return res.status(400).json({ message: "Invalid action" });
  }

  try {
    const driverRequest = await Driver.findById(driverId);

    if (!driverRequest) {
      return res.status(404).json({ message: "Driver request not found" });
    }

    // Update requestStatus based on the action
    driverRequest.requestStatus =
      action === "approve" ? "approved" : "rejected";

    // If approved, set the driver's status to 'available'
    if (action === "approve") {
      driverRequest.status = "available"; // Or any other status logic
    }

    await driverRequest.save();

    // Send a response or notification to the driver (optional)
    // Here, you'd notify via email or in-app notification

    res.status(200).json({ message: `Driver request ${action}d successfully` });
  } catch (error) {
    console.error("Error updating driver request:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

const DeleteDriver = async (req, res) => {
  try {
    const { driverId } = req.params;

    // Find and delete the driver by their ID
    const driver = await Driver.findByIdAndDelete(driverId);

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // Respond with success message
    res.status(200).json({ message: "Driver deleted successfully" });
  } catch (error) {
    // Handle unexpected errors gracefully
    console.error("Error deleting driver:", error);
    res.status(500).json({ message: "Failed to delete driver" });
  }
};

const DeleteVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    // Find and delete the driver by their ID
    const vehicle = await Vehicle.findByIdAndDelete(vehicleId);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Respond with success message
    res.status(200).json({ message: "Vehiicle deleted successfully" });
  } catch (error) {
    // Handle unexpected errors gracefully
    console.error("Error deleting vehicle:", error);
    res.status(500).json({ message: "Failed to delete vehicle" });
  }
};

const BookingsList = async (req, res) => {
  try {
    const booking = await Booking.find()
      .populate("vehicle")
      .populate("user")
      .populate("driver");
    res.status(200).json(booking);
  } catch (error) {
    // Handle unexpected errors gracefully
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

module.exports = {
  getAnalytics,
  driverRequestsforAdmin,
  approveOrRejectDriverRequest,
  DeleteDriver,
  DeleteVehicle,
  BookingsList,
};
