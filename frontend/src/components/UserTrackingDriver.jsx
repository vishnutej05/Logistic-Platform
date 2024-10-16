// src/components/UserTracking.js
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Replace with your server address

const UserTracking = () => {
  const [driverLocation, setDriverLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    // Listen for real-time location updates
    socket.on("trackDriver", (locationData) => {
      console.log("Tracking Driver:", locationData);
      setDriverLocation(locationData);
    });

    // Clean up listener on unmount
    return () => {
      socket.off("trackDriver");
    };
  }, []);

  return (
    <div>
      <h2>Driver Location:</h2>
      <p>Latitude: {driverLocation.latitude}</p>
      <p>Longitude: {driverLocation.longitude}</p>
    </div>
  );
};

export default UserTracking;
