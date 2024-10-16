const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["bike", "car", "van", "truck"],
      required: true,
    },
    capacity: { type: Number, required: true },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    }, // Assign to driver
    availability: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
