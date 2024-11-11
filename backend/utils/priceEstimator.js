const vehicleRates = {
  bike: [2000, 15], // Example: 20 per km
  car: [4000, 20], // Example: 40 per km
  van: [8000, 25], // Example: 60 per km
  truck: [10000, 30], // Example: 100 per km
};

// Function to estimate price based on vehicle type and distance
const estimatePrice = (vehicleType, distance) => {
  const rate = vehicleRates[vehicleType.toLowerCase()];
  if (!rate) {
    throw new Error("Invalid vehicle type");
  }
  const result = rate[0] + distance * rate[1];
  return result;
};
module.exports = estimatePrice;
