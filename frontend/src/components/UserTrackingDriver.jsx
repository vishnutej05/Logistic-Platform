// src/components/UserTracking.js
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  GoogleMap,
  Marker,
  Polyline,
  useLoadScript,
} from "@react-google-maps/api";

const socket = io("http://localhost:5000"); // Replace with your server address

const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};

const defaultCenter = {
  lat: 28.6139, // Default center (New Delhi or any location of choice)
  lng: 77.209,
};

const polylineOptions = {
  strokeColor: "#FF0000",
  strokeOpacity: 1.0,
  strokeWeight: 3,
};

const UserTracking = () => {
  const [driverLocation, setDriverLocation] = useState(null); // Current driver location
  const [path, setPath] = useState([]); // Path for the Polyline

  // Load Google Maps script
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Replace with your API Key
  });

  useEffect(() => {
    // Listen for real-time location updates
    socket.on("trackDriver", (locationData) => {
      console.log("Tracking Driver:", locationData);

      // Add the new location to the path
      setPath((prevPath) => [
        ...prevPath,
        { lat: locationData.latitude, lng: locationData.longitude },
      ]);

      // Update driver's current location
      setDriverLocation({
        lat: locationData.latitude,
        lng: locationData.longitude,
      });
    });

    // Clean up listener on component unmount
    return () => {
      socket.off("trackDriver");
    };
  }, []);

  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={14}
      center={driverLocation || defaultCenter} // Center map on driver location or default center
    >
      {/* Marker at the driver's current location */}
      {driverLocation && <Marker position={driverLocation} />}

      {/* Polyline to track the driver's movement */}
      {path.length > 1 && <Polyline path={path} options={polylineOptions} />}
    </GoogleMap>
  );
};

export default UserTracking;
