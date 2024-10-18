import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useLoadScript } from "@react-google-maps/api";
import axios from "axios";

const socket = io("http://localhost:5000"); // Replace with actual backend address

// const mapContainerStyle = {
//   width: "100%",
//   height: "100vh", // Full-screen map
// };

// const defaultCenter = {
//   lat: 28.6139, // Default center (New Delhi)
//   lng: 77.209,
// };

const DriverTracking = () => {
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
        const response = await axios.get(
          "http://localhost:5000/api/driver/details",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

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
    <div style={styles.container}>
      <div style={styles.infoContainer}>
        <h2 style={styles.header}>Driver Tracking</h2>
        <p style={styles.infoText}>
          <strong>Driver Name:</strong> {driverName ? driverName : "Loading..."}
        </p>
        <p style={styles.infoText}>
          <strong>Current Location:</strong>{" "}
          {driverLocation
            ? `Lat: ${driverLocation.lat}, Lng: ${driverLocation.lng}`
            : "Location unavailable"}
        </p>
      </div>

      {/* <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={driverLocation || defaultCenter}
      >
        {driverLocation && <Marker position={driverLocation} />}
      </GoogleMap> */}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "500px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f5f5f5",
  },
  infoContainer: {
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  header: {
    fontSize: "24px",
    marginBottom: "10px",
    color: "#333",
  },
  infoText: {
    fontSize: "18px",
    margin: "8px 0",
    color: "#555",
  },
};

export default DriverTracking;
