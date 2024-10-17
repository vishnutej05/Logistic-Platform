const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["bike", "car", "van", "truck"],
      required: true,
    },
    capacity: { type: Number, required: true },
    plateNumber: { type: String, required: true }, // New field for plate number
    model: { type: String, required: true }, // New field for model
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },
    availability: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
