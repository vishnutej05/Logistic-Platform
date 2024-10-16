const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    price: { type: Number, required: true },
    distance: { type: Number, required: true }, // distance in km
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
