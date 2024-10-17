import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import axios from "axios";

const libraries = ["places"];

const CreateBooking = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [distance, setDistance] = useState(0);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const autocompletePickupRef = useRef(null);
  const autocompleteDropoffRef = useRef(null);

  // Function to get the token from cookies
  const getToken = () => {
    const tokenString = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    return tokenString ? tokenString.split("=")[1] : null;
  };

  // Fetch vehicles (memoized with useCallback)
  const fetchVehicles = useCallback(async () => {
    setLoadingVehicles(true);
    try {
      const response = await axios.get("http://localhost:5000/api/vehicle/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      alert("Failed to load vehicles.");
    } finally {
      setLoadingVehicles(false);
    }
  }, []); // Empty dependency array ensures it only gets created once

  // Fetch drivers (memoized with useCallback)
  const fetchDrivers = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/driver/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setDrivers(response.data);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      alert("Failed to load drivers.");
    }
  }, []); // Empty dependency array ensures it only gets created once

  // Run fetchVehicles and fetchDrivers when component mounts
  useEffect(() => {
    fetchVehicles();
    fetchDrivers();
  }, [fetchVehicles, fetchDrivers]); // Add both functions to the dependency array

  const handlePickupPlaceChange = () => {
    const place = autocompletePickupRef.current.getPlace();
    if (place && place.geometry) {
      setPickup({
        address: place.formatted_address,
        coordinates: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        },
      });
    }
  };

  const handleDropoffPlaceChange = () => {
    const place = autocompleteDropoffRef.current.getPlace();
    if (place && place.geometry) {
      setDropoff({
        address: place.formatted_address,
        coordinates: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        },
      });
    }
  };

  const handleBookingSubmit = async () => {
    if (
      !selectedVehicle ||
      !pickup ||
      !dropoff ||
      !selectedDriver ||
      !distance
    ) {
      alert(
        "Please select a vehicle, driver, enter both pickup and dropoff locations, and specify the distance."
      );
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/bookings",
        {
          vehicleId: selectedVehicle,
          driverId: selectedDriver,
          pickupLocation: pickup,
          dropoffLocation: dropoff,
          distance: parseFloat(distance), // Ensure distance is a number
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      alert(`Booking created! Booking ID: ${response.data.booking._id}`);
    } catch (error) {
      console.error("Booking error:", error);
      alert("Booking failed.");
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      <h2>Create a Booking</h2>

      {/* Pickup Location */}
      <Autocomplete
        onLoad={(autocomplete) =>
          (autocompletePickupRef.current = autocomplete)
        }
        onPlaceChanged={handlePickupPlaceChange}
      >
        <input
          type="text"
          placeholder="Enter pickup location"
          style={{ width: "300px", height: "40px", marginBottom: "20px" }}
        />
      </Autocomplete>

      {/* Dropoff Location */}
      <Autocomplete
        onLoad={(autocomplete) =>
          (autocompleteDropoffRef.current = autocomplete)
        }
        onPlaceChanged={handleDropoffPlaceChange}
      >
        <input
          type="text"
          placeholder="Enter dropoff location"
          style={{ width: "300px", height: "40px", marginBottom: "20px" }}
        />
      </Autocomplete>

      {/* Vehicle Selection */}
      <label>Vehicle:</label>
      <select
        value={selectedVehicle}
        onChange={(e) => setSelectedVehicle(e.target.value)}
      >
        <option value="">Select a vehicle</option>
        {vehicles.map((vehicle) => (
          <option key={vehicle._id} value={vehicle._id}>
            {vehicle.type} (Capacity: {vehicle.capacity})
          </option>
        ))}
      </select>

      {/* Driver Selection */}
      <label>Driver:</label>
      <select
        value={selectedDriver}
        onChange={(e) => setSelectedDriver(e.target.value)}
      >
        <option value="">Select a driver</option>
        {drivers.map((driver) => (
          <option key={driver._id} value={driver._id}>
            {driver.name} ({driver.status})
          </option>
        ))}
      </select>

      {/* Distance Input */}
      <br />
      <br />
      <input
        type="number"
        placeholder="Enter distance in kilometers"
        value={distance}
        onChange={(e) => setDistance(e.target.value)}
        style={{ width: "300px", height: "40px", marginBottom: "20px" }}
      />

      {/* Submit Button */}
      <button onClick={handleBookingSubmit} disabled={loadingVehicles}>
        {loadingVehicles ? "Loading vehicles..." : "Submit Booking"}
      </button>
    </div>
  );
};

export default CreateBooking;
