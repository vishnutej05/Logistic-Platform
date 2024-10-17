const express = require("express");
const Vehicle = require("../models/Vehicle");
const router = express.Router();

// Create a new vehicle (only for admins)
router.post("/create", async (req, res) => {
  const { type, plateNumber, model, capacity, availability } = req.body;

  // Check for required fields
  if (!type || !plateNumber || !model || !capacity) {
    return res.status(400).json({
      message: "Type, plateNumber, model, and capacity are required.",
    });
  }

  // Check if the user is an admin
  // if (req.role !== "admin") {
  //   return res
  //     .status(403)
  //     .json({ message: "Access denied. Only admins can add vehicles." });
  // }

  try {
    const newVehicle = new Vehicle({
      type,
      plateNumber,
      model,
      capacity,
      availability,
    });

    await newVehicle.save();
    res
      .status(201)
      .json({ message: "Vehicle created successfully", vehicle: newVehicle });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating vehicle", error: error.message });
  }
});

// Get all vehicles
router.get("/", async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate("driver");
    res.status(200).json(vehicles);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching vehicles", error: error.message });
  }
});

module.exports = router;
