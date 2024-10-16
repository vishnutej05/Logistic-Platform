const Booking = require("../models/Booking");
const Driver = require("../models/Driver");

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

module.exports = { getAnalytics };
