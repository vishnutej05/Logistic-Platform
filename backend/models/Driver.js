const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    licenseNumber: { type: String },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      default: null,
    },
    phone: {
      type: Number,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["available", "busy", "not-ready"],
      default: "not-ready",
      required: true,
    },
    level: {
      type: Number,
      default: 0,
    },
    requestStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending", // New requests default to "pending" until reviewed by an admin
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);
