import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useLoadScript } from "@react-google-maps/api";
import site from "../common/API";
import "./DriverLocation.css";

const socket = io("http://localhost:5000"); // Replace with actual backend address

const DriverLocation = () => {
  const [driverLocation, setDriverLocation] = useState(null);
  const [driverName, setDriverName] = useState(null); // State to hold driver's name

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Replace with your API key
  });

  const getToken = () => {
    const tokenString = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    return tokenString ? tokenString.split("=")[1] : null;
  };

  useEffect(() => {
    // Fetch driver details
    const fetchDriverDetails = async () => {
      try {
        const response = await site.get("/api/driver/details", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        });

        setDriverName(response.data.name); // Set driver's name
      } catch (error) {
        console.error("Error fetching driver details:", error);
      }
    };

    fetchDriverDetails();
  }, []);

  useEffect(() => {
    // Get and track the driver's location
    const trackDriverLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (position) => {
            const locationData = {
              driverName: driverName, // Use driver's name
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };

            // Emit location updates to the server
            socket.emit("driverLocationUpdate", locationData);
            setDriverLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Error getting location:", error);
          }
        );
      } else {
        console.error("Geolocation not supported.");
      }
    };

    if (driverName) {
      trackDriverLocation();
    }
  }, [driverName]); // Dependency on driverName to ensure it's available

  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div className="driver-location-container">
      <div className="info-container">
        <h2 className="header">Driver Tracking</h2>
        <p className="info-text">
          <strong>Driver Name:</strong> {driverName ? driverName : "Loading..."}
        </p>
        <p className="info-text">
          <strong>Current Location:</strong>{" "}
          {driverLocation
            ? `Lat: ${driverLocation.lat}, Lng: ${driverLocation.lng}`
            : "Location unavailable"}
        </p>
      </div>

      {/* 
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={driverLocation || defaultCenter}
      >
        {driverLocation && <Marker position={driverLocation} />}
      </GoogleMap> 
      */}
    </div>
  );
};

export default DriverLocation;
