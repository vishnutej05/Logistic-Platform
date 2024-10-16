const Driver = require("../models/Driver"); // Import the Driver model
const Vehicle = require("../models/Vehicle"); // Import the Vehicle model for validation

// Assign a vehicle to a driver
// const assignVehicle = async (req, res) => {
//   try {
//     const { driverId, vehicleId } = req.body;
//     const driver = await Driver.findById(driverId);
//     const vehicle = await Vehicle.findById(vehicleId);

//     if (!driver || !vehicle) {
//       return res.status(404).json({ error: "Driver or Vehicle not found" });
//     }

//     driver.vehicle = vehicleId;
//     vehicle.driver = driverId;

//     await driver.save();
//     await vehicle.save();

//     res.status(200).json({ message: "Vehicle assigned to driver" });
//   } catch (error) {
//     res.status(500).json({ error: "Assignment failed" });
//   }
// };

const createDriver = async (req, res) => {
  const { name, licenseNumber, phone, vehicleId, status } = req.body;

  // Check for required fields
  if (!name || !licenseNumber || !phone || !vehicleId || !status) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Optional: Check if the status is valid
  const validStatuses = ["available", "busy"];
  if (!validStatuses.includes(status)) {
    return res
      .status(400)
      .json({ message: "Invalid status. Must be 'available' or 'busy'." });
  }

  if (req.role !== "driver") {
    return res
      .status(403)
      .json({ message: "Access denied. Only drivers can create drivers." });
  }

  try {
    // Check if the vehicle exists
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found." });
    }

    // Create a new driver
    const newDriver = new Driver({
      name,
      licenseNumber,
      phone,
      vehicle: vehicleId, // Assuming the Driver model references the Vehicle
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
module.exports = { createDriver, driversList };
