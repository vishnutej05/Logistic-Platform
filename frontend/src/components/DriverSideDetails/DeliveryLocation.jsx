import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};

const defaultCenter = {
  lat: 28.6139,
  lng: 77.209,
};

// Define libraries as a constant outside the component to avoid recreation
const libraries = ["marker"];

const DeliveryLocation = () => {
  const location = useLocation();
  const { pickupAddress, dropoffAddress } = location.state || {};

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries, // Use the constant libraries array here
  });

  const mapRef = useRef(null);

  useEffect(() => {
    const setupMarkers = async () => {
      if (isLoaded && mapRef.current && pickupAddress && dropoffAddress) {
        try {
          // Load the AdvancedMarkerView library
          const { AdvancedMarkerView } = await window.google.maps.importLibrary(
            "marker"
          );

          // Initialize pickup marker
          const pickupMarker = new AdvancedMarkerView({
            map: mapRef.current,
            position: { lat: pickupAddress.lat, lng: pickupAddress.lng },
            title: "Pickup Location",
          });

          // Initialize dropoff marker
          const dropoffMarker = new AdvancedMarkerView({
            map: mapRef.current,
            position: { lat: dropoffAddress.lat, lng: dropoffAddress.lng },
            title: "Dropoff Location",
          });

          // Clean up markers on unmount
          return () => {
            pickupMarker.setMap(null);
            dropoffMarker.setMap(null);
          };
        } catch (error) {
          console.error("Error loading AdvancedMarkerView:", error);
        }
      }
    };

    setupMarkers();
  }, [isLoaded, pickupAddress, dropoffAddress]);

  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <>
      <h1>Delivery Location</h1>
      <p>
        <strong>Pickup Address:</strong>{" "}
        {`${pickupAddress?.lat}, ${pickupAddress?.lng}`}
      </p>
      <p>
        <strong>Dropoff Address:</strong>{" "}
        {`${dropoffAddress?.lat}, ${dropoffAddress?.lng}`}
      </p>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={pickupAddress || defaultCenter}
        onLoad={(map) => (mapRef.current = map)}
      />
    </>
  );
};

export default DeliveryLocation;
