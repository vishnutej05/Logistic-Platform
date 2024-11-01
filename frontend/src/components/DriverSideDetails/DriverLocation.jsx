import React, { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
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

        console.log("Driver details fetched:", data); // Log data for verification

        setDriverInfo({
          location: driverInfo.location, // Preserve location if already set
          name: data.name,
          level: data.level,
        });
      } catch (error) {
        console.error("Error fetching driver details:", error);
      }
    };
    fetchDriverDetails();
  }, [getToken]);

  // Track driver's location
  useEffect(() => {
    if (!driverInfo.name) return;

    const handleLocationUpdate = (position) => {
      const { latitude, longitude } = position.coords;
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
    };

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(handleLocationUpdate, (error) =>
        console.error("Error getting location:", error)
      );
    } else {
      console.error("Geolocation not supported.");
    }
  }, [driverInfo.name]);

  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div className="driver-location-container">
      <div className="info-container">
        <h2 className="header">Driver Tracking</h2>
        <p className="info-text">
          <strong>Driver Name:</strong> {driverInfo.name || "Loading..."}
        </p>
        <p className="info-text">
          <strong>Driver Experience:</strong>{" "}
          {driverInfo.level !== null ? driverInfo.level : "Loading..."} Rides
        </p>
        <p className="info-text">
          <strong>Current Location:</strong>{" "}
          {driverInfo.location
            ? `Lat: ${driverInfo.location.lat}, Lng: ${driverInfo.location.lng}`
            : "Location unavailable"}
        </p>
      </div>

      {/* 
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={driverInfo.location || defaultCenter}
      >
        {driverInfo.location && <Marker position={driverInfo.location} />}
      </GoogleMap> 
      */}
    </div>
  );
};

export default DriverLocation;
