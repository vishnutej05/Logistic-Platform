import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import axios from "axios";
// import { useNavigate } from "react-router-dom";

const libraries = ["places"];

const CreateBooking = () => {
  // const navigate = useNavigate();

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
  const [price, setPrice] = useState(null); // New state to hold price
  const autocompletePickupRef = useRef(null);
  const autocompleteDropoffRef = useRef(null);

  const getToken = () => {
    const tokenString = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    return tokenString ? tokenString.split("=")[1] : null;
  };

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
  }, []);

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
  }, []);

  useEffect(() => {
    fetchVehicles();
    fetchDrivers();
  }, [fetchVehicles, fetchDrivers]);

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
    const selectedDriverObj = drivers.find(
      (driver) => driver._id === selectedDriver
    );
    if (selectedDriverObj && selectedDriverObj.status === "busy") {
      alert(
        "The selected driver is currently busy. Please choose an available driver."
      );
      return;
    }

    const selectedVehicleObj = vehicles.find(
      (vehicle) => vehicle._id === selectedVehicle
    );
    if (selectedVehicleObj && !selectedVehicleObj.availability) {
      alert("The selected vehicle is not available at this time.");
      return;
    }

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

    if (distance <= 0) {
      alert("Don't enter negative or zero distance.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/bookings",
        {
          vehicleId: selectedVehicle,
          driverId: selectedDriver,
          pickupLocation: {
            address: pickup.address,
            coordinates: {
              lat: pickup.coordinates.lat,
              lng: pickup.coordinates.lng,
            },
          },
          dropoffLocation: {
            address: dropoff.address,
            coordinates: {
              lat: dropoff.coordinates.lat,
              lng: dropoff.coordinates.lng,
            },
          },
          status: "pending",
          distance: parseFloat(distance),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      // Set the price state with the returned price
      //   console.log(response.data.booking.price);
      setPrice(response.data.booking.price);
      alert(`Booking created! Booking ID: ${response.data.booking._id}`);
      // navigate("/track-driver");
    } catch (error) {
      console.error("Booking error:", error);
      alert("Booking failed.");
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      <h2>Create a Booking</h2>

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

      <label>Vehicle:</label>
      <select
        value={selectedVehicle}
        onChange={(e) => setSelectedVehicle(e.target.value)}
      >
        <option value="">Select a vehicle</option>
        {/* {console.log(vehicles)} */}
        {vehicles.map((vehicle) => (
          <option key={vehicle._id} value={vehicle._id}>
            {`Type: ${vehicle.type}||  Model: ${vehicle.model}|| Capacity: ${
              vehicle.capacity
            }|| Available: ${vehicle.availability ? "Yes" : "No"}`}
          </option>
        ))}
      </select>

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

      <br />
      <br />
      <input
        type="number"
        placeholder="Enter distance in kilometers"
        value={distance}
        onChange={(e) => setDistance(e.target.value)}
        style={{ width: "300px", height: "40px", marginBottom: "20px" }}
      />

      <button onClick={handleBookingSubmit} disabled={loadingVehicles}>
        {loadingVehicles ? "Loading vehicles..." : "Submit Booking"}
      </button>

      {/* Display price once booking is confirmed */}
      {price && (
        <div style={{ marginTop: "20px", fontWeight: "bold" }}>
          Price: ₹{price}
        </div>
      )}
    </div>
  );
};

export default CreateBooking;
