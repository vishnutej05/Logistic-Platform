// src/components/DriverTracking.js
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const socket = io("http://localhost:5000"); // Replace with your server address

// Map container styling
const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};

// Default center (for initial render if location is not available yet)
const defaultCenter = {
  lat: 28.6139, // New Delhi (or choose your default location)
  lng: 77.209,
};

const DriverTracking = () => {
  const [driverLocation, setDriverLocation] = useState(null);

  // Load Google Maps API
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Ensure your API key is here
  });

  useEffect(() => {
    // Function to send location updates to the server
    const sendLocationUpdate = (position) => {
      const locationData = {
        driverId: "123", // Replace with actual driver ID
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      // Send location data to the server
      socket.emit("driverLocationUpdate", locationData);
      // Update driver's location state for the map marker
      setDriverLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    };

    // Track the driver's location in real-time
    const trackDriverLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(sendLocationUpdate, (error) => {
          console.error("Error getting location:", error);
        });
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    // Start tracking
    trackDriverLocation();
  }, []);

  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <>
      {console.log(driverLocation)}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={driverLocation || defaultCenter} // Center on driver's location if available
      >
        {/* Place a marker at the driver's current location */}
        {driverLocation && <Marker position={driverLocation} />}
      </GoogleMap>
    </>
  );
};

export default DriverTracking;
