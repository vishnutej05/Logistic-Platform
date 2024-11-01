// src/components/UserTracking.js
import React, { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  GoogleMap,
  Marker,
  Polyline,
  useLoadScript,
} from "@react-google-maps/api";
import AppContext from "../../context/AppContext";
import "./UserTracking.css";

const socket = io("http://localhost:5000"); // Replace with your server address

const mapContainerStyle = {
  width: "85vw",
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
  const { booking } = useContext(AppContext);

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
    <div className="container">
      <h2 className="headings">Tracking Driver for Booking</h2>
      <p>
        <strong>Pickup:</strong>
        {!booking ? "Unable to fetch now" : booking.pickupLocation.address}
      </p>
      <p>
        <strong>Dropoff:</strong>
        {!booking ? "Unable to fetch now" : booking.dropoffLocation.address}
      </p>
      <p>
        <strong>Driver:</strong>
        {!booking ? "Unable to fetch now" : booking.driver.name}
      </p>
      <h2 className="headings">You are now tracking drivers movement</h2>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={driverLocation || defaultCenter} // Center map on driver location or default center
      >
        {/* Marker at the driver's current location */}
        {driverLocation && <Marker position={driverLocation} />}

        {/* Marker at the starting point of the polyline (first path point) */}
        {path.length > 0 && <Marker position={path[0]} />}

        {/* Polyline to track the driver's movement */}
        {path.length > 1 && <Polyline path={path} options={polylineOptions} />}
      </GoogleMap>
    </div>
  );
};

export default UserTracking;
