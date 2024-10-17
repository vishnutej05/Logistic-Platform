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
  const { name, licenseNumber, phone, status } = req.body;

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
module.exports = { createDriver, driversList };
