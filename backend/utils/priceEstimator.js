const vehicleRates = {
  bike: 20, // Example: 20 per km
  car: 40, // Example: 40 per km
  van: 60, // Example: 60 per km
  truck: 100, // Example: 100 per km
};

// Function to estimate price based on vehicle type and distance
const estimatePrice = (vehicleType, distance) => {
  const rate = vehicleRates[vehicleType.toLowerCase()];
  if (!rate) {
    throw new Error("Invalid vehicle type");
  }
  return distance * rate;
};

module.exports = estimatePrice;
