// src/components/DriverTracking.js
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const socket = io("http://localhost:5000"); // Replace with actual backend address

const mapContainerStyle = {
  width: "100%",
  height: "100vh", // Full-screen map
};

const defaultCenter = {
  lat: 28.6139, // Default center (New Delhi)
  lng: 77.209,
};

const DriverTracking = () => {
  const [driverLocation, setDriverLocation] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Replace with your API key
  });

  useEffect(() => {
    // Get and track the driver's location
    const trackDriverLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (position) => {
            const locationData = {
              driverId: "123", // Replace with actual driver ID
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };

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

    trackDriverLocation();
  }, []);

  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={14}
      center={driverLocation || defaultCenter}
    >
      {driverLocation && <Marker position={driverLocation} />}
    </GoogleMap>
  );
};

export default DriverTracking;
