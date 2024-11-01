import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import site from "../common/API";
import "./CreateBooking.css"; // Import the new CSS
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
      const response = await site.get("/api/vehicle/", {
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
      const response = await site.get("/api/driver/", {
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
      const response = await site.post(
        "/api/bookings",
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
      // console.log(response.data.booking.price);
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
    <div className="booking-container">
      <div className="title">
        <h2 className="booking-title">Create a Booking</h2>
      </div>
      <label className="input-label">Pickup Adress:</label>
      <Autocomplete
        onLoad={(autocomplete) =>
          (autocompletePickupRef.current = autocomplete)
        }
        onPlaceChanged={handlePickupPlaceChange}
      >
        <input
          className="autocomplete-input"
          type="text"
          placeholder="Enter pickup location"
        />
      </Autocomplete>

      <label className="input-label">Dropoff Address:</label>
      <Autocomplete
        onLoad={(autocomplete) =>
          (autocompleteDropoffRef.current = autocomplete)
        }
        onPlaceChanged={handleDropoffPlaceChange}
      >
        <input
          className="autocomplete-input"
          type="text"
          placeholder="Enter dropoff location"
        />
      </Autocomplete>

      <label className="input-label">Select Vehicle:</label>
      <div className="options-container">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle._id}
            className={`card ${
              selectedVehicle === vehicle._id ? "selected" : ""
            }`}
            onClick={() => setSelectedVehicle(vehicle._id)}
          >
            <h2 className="head">
              {vehicle.model} ({vehicle.type})
            </h2>
            <p>Capacity: {vehicle.capacity}</p>
            <p>Vehicle Availability: {vehicle.availability ? "Yes" : "No"}</p>
          </div>
        ))}
      </div>

      <label className="input-label">Select Driver:</label>
      <div className="options-container">
        {drivers.map((driver) => (
          <div
            key={driver._id}
            className={`card ${
              selectedDriver === driver._id ? "selected" : ""
            }`}
            onClick={() => setSelectedDriver(driver._id)}
          >
            {/* {console.log(driver)} */}
            <h2 className="head">
              {driver.name} (Contact: {String(driver.phone).slice(2)})
            </h2>
            <p>Rides Completed: {driver.level} </p>
            <p>
              Rides Driver Availability:
              {driver.status === "available" ? "Yes" : "No"}
            </p>
          </div>
        ))}
      </div>

      <label className="input-label">Distance (in km):</label>
      <input
        type="number"
        value={distance}
        onChange={(e) => setDistance(e.target.value)}
      />

      {price !== null && (
        <div className="price-display">
          Estimated Price: ${price.toFixed(2)}
        </div>
      )}

      <div className="button-section">
        <button className="submit-button" onClick={handleBookingSubmit}>
          Create Booking
        </button>
      </div>
    </div>
  );
};

export default CreateBooking;
