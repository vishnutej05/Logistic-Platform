const vehicleRates = {
  bike: 1.5, // Example: $1.5 per km
  car: 2.0, // Example: $2.0 per km
  van: 2.5, // Example: $2.5 per km
  truck: 3.0, // Example: $3.0 per km
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
