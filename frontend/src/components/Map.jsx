// src/components/Map.js
import React from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

// Google Maps API options
const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};

const center = {
  lat: 28.6139, // Default center (e.g., New Delhi, India)
  lng: 77.209,
};

const Map = ({ driverLocation }) => {
  // Load the Google Maps API using the API key from environment
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <div>Loading Maps...</div>;

  console.log("Im in Map", {
    lat: driverLocation.lat,
    lng: driverLocation.lng,
  });

  return (
    <GoogleMap mapContainerStyle={mapContainerStyle} zoom={14} center={center}>
      {/* Add Marker for the driver's location */}
      {driverLocation && (
        <Marker
          position={{ lat: driverLocation.lat, lng: driverLocation.lng }}
        />
      )}
    </GoogleMap>
  );
};

export default Map;
