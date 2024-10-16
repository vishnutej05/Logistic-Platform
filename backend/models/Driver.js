const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "busy"],
      default: "available",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);
