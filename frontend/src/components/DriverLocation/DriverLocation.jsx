import React, { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { Tooltip, IconButton } from "@mui/material";
import Zoom from "@mui/material/Zoom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useLoadScript } from "@react-google-maps/api";
import site from "../common/API";
import "./DriverLocation.css";

const socket = io("http://localhost:5000"); // Replace with actual backend address

const DriverLocation = () => {
  const [driverInfo, setDriverInfo] = useState({
    location: null,
    name: null,
    level: null,
  });
  // const [driverLocation, setDriverLocation] = useState(null);
  const [movementInterval, setMovementInterval] = useState(null); // To simulate movement
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const getToken = useCallback(() => {
    const tokenString = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    return tokenString ? tokenString.split("=")[1] : null;
  }, []);

  // Fetch driver details once on mount
  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        const { data } = await site.get("/api/driver/details", {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        setDriverInfo((prevInfo) => ({
          ...prevInfo,
          name: data.name,
          level: data.level,
        }));
      } catch (error) {
        console.error("Error fetching driver details:", error);
      }
    };
    fetchDriverDetails();
  }, [getToken]);

  // Track driver's location and send updates to the server
  useEffect(() => {
    if (!driverInfo.name) return;

    const handleLocationUpdate = (position) => {
      const { latitude, longitude } = position.coords;

      // Only update if location has changed significantly
      if (
        !driverInfo.location ||
        Math.abs(driverInfo.location.lat - latitude) > 0.0001 ||
        Math.abs(driverInfo.location.lng - longitude) > 0.0001
      ) {
        const locationData = {
          driverName: driverInfo.name,
          latitude,
          longitude,
        };

        socket.emit("driverLocationUpdate", locationData);
        setDriverInfo((prevInfo) => ({
          ...prevInfo,
          location: { lat: latitude, lng: longitude },
        }));
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(handleLocationUpdate, (error) =>
        console.error("Error getting location:", error)
      );
    } else {
      console.error("Geolocation not supported.");
    }

    // Clean up socket and geolocation on component unmount
    return () => {
      socket.off("driverLocationUpdate");
    };
  }, [driverInfo.name, driverInfo.location]);

  // Simulate driver movement for testing
  useEffect(() => {
    const simulateDriverMovement = () => {
      let lat = 17.5319321; // Starting latitude
      let lng = 78.5187863; // Starting longitude
      const speed = 0.01; // Movement speed
      const interval = setInterval(() => {
        lat += (Math.random() - 0.5) * speed; // Random latitude change
        lng += (Math.random() - 0.5) * speed; // Random longitude change
        const locationData = {
          driverId: "123", // This could be dynamic based on actual driver ID
          latitude: lat,
          longitude: lng,
        };
        // Emit location updates to the server
        socket.emit("driverLocationUpdate", locationData);
      }, 2000); // Update every 2 seconds
      setMovementInterval(interval);

      return () => clearInterval(interval); // Clean up on unmount
    };

    simulateDriverMovement();

    // Cleanup interval on component unmount
    return () => clearInterval(movementInterval);
  }, [movementInterval]);

  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div className="driver-location-tooltip-container">
      <Tooltip
        TransitionComponent={Zoom}
        title={
          <div className="driver-info-overlay">
            <p>
              <strong>Driver Name:</strong> {driverInfo.name || "Loading..."}
            </p>
            <p>
              <strong>Driver Experience:</strong>{" "}
              {driverInfo.level !== null ? driverInfo.level : "Loading..."}{" "}
              Rides
            </p>
            <p>
              <strong>Current Location:</strong> <br />
              {driverInfo.location
                ? `Lat: ${driverInfo.location.lat}, Lng: ${driverInfo.location.lng}`
                : "Location unavailable"}
            </p>
          </div>
        }
        placement="top"
        arrow
        enterDelay={1}
        leaveDelay={1}
      >
        <IconButton>
          <LocationOnIcon fontSize="large" style={{ color: "#0056b3" }} />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default DriverLocation;
