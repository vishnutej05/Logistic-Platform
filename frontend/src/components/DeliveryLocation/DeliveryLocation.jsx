import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import site from "../common/API.js";
import "./DeliveryLocation.css"; // Import CSS for styling

const getToken = () =>
  document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};

const defaultCenter = {
  lat: 28.6139,
  lng: 77.209,
};

// Use "places" library for markers
const libraries = ["places"];

const DeliveryLocation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking } = location.state || {};
  const {
    pickupAddress,
    dropoffAddress,
    pickupCords,
    dropoffCords,
    distance,
    price,
  } = booking || {};

  // State to manage map visibility
  const [isMapVisible, setIsMapVisible] = useState(true);
  const [isRideEnded, setIsRideEnded] = useState(false); // State to manage ride end

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const startRide = async () => {
    const confirmStart = window.confirm(
      "The user will be notified that the ride has started. Do you want to start the ride?"
    );
    if (confirmStart) {
      try {
        const { status } = await site.post(
          `api/driver/start-ride/${booking.id}`,
          {},
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );
        alert(status === 200 ? "Ride Started!" : "Ride already started!");
      } catch (error) {
        alert(error.response.data);
      }
    }
  };

  const endRide = async () => {
    const confirmEnd = window.confirm(
      "The user will be notified that the ride has finished. Do you want to finish the ride?"
    );
    if (confirmEnd) {
      try {
        const { status } = await site.post(
          `api/driver/end-ride/${booking.id}`,
          {},
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );
        alert(status === 200 ? "Ride Ended!" : "Ride already ended!");

        // Set state to hide map and show thank you card
        setIsMapVisible(false);
        setIsRideEnded(true);
      } catch (error) {
        alert(error.response.data);
      }
    }
  };

  const mapRef = useRef(null);

  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div className="delivery-location">
      {/* Conditional rendering based on ride end status */}
      {!isRideEnded ? (
        <>
          <h1>Delivery Location</h1>
          <div className="info-container">
            <p>
              <strong>Pickup Address:</strong> {pickupAddress}
            </p>
            <p>
              <strong>Dropoff Address:</strong> {dropoffAddress}
            </p>
            <p>
              <strong>Distance:</strong> {distance} km
            </p>
          </div>
          <div className="button-container">
            <button className="ride-button" onClick={startRide}>
              Start Ride
            </button>
            <button className="ride-button" onClick={endRide}>
              End Ride
            </button>
          </div>
        </>
      ) : (
        <div className="thank-you-card">
          <h2>Thank You for Delivering the Goods!</h2>
          <p>Collect your price: ${price} from the admin</p>
          <button
            className="back-button"
            onClick={() => navigate("/driver-dashboard")}
          >
            Back to Driver Dashboard
          </button>
        </div>
      )}

      {/* Conditional rendering for Google Map */}
      {isMapVisible && !isRideEnded && (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={14}
          center={pickupCords || defaultCenter}
          onLoad={(map) => (mapRef.current = map)}
        >
          {/* Display Pickup Marker */}
          {pickupCords && (
            <Marker position={pickupCords} title="Pickup Location" />
          )}

          {/* Display Dropoff Marker */}
          {dropoffCords && (
            <Marker position={dropoffCords} title="Dropoff Location" />
          )}

          {/* Polyline between Pickup and Dropoff */}
          {pickupCords && dropoffCords && (
            <Polyline
              path={[pickupCords, dropoffCords]}
              options={{
                strokeColor: "#0000FF",
                strokeOpacity: 0.6,
                strokeWeight: 4,
              }}
            />
          )}
        </GoogleMap>
      )}
    </div>
  );
};

export default DeliveryLocation;
