import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import site from "../common/API";
import "./UserDashboard.css";

export default function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getToken = () => {
    const tokenString = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    return tokenString ? tokenString.split("=")[1] : null;
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await site.get("/api/bookings", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        });
        setBookings(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCreateBooking = () => {
    navigate("/create-booking");
  };

  const trackDriver = () => {
    navigate("/track-driver");
  };

  return (
    <div className="dashboard-container">
      <h1 className="head">User Dashboard</h1>
      <h2>Bookings</h2>
      <div className="bookings-container">
        {loading ? (
          <p>Loading bookings...</p>
        ) : bookings.length > 0 ? (
          bookings.map((booking) => (
            <div className="booking-card" key={booking._id}>
              <h3>Booking Details</h3>
              <p>
                <strong>Pickup:</strong> {booking.pickupLocation.address}
              </p>
              <p>
                <strong>Dropoff:</strong> {booking.dropoffLocation.address}
              </p>
              <p>
                <strong>Driver:</strong> {booking.driver.name}
              </p>
              <p>
                <strong>Vehicle:</strong> {booking.vehicle.model}
              </p>
              <p>
                <strong>Status:</strong> {booking.status}
              </p>
              <p>
                <strong>Price:</strong> ₹{booking.price}
              </p>
              <p>
                <strong>Distance:</strong> {booking.distance} km
              </p>
              <p>
                <strong>Booking Date:</strong>{" "}
                {new Date(booking.createdAt).toLocaleString()}
              </p>
              <button onClick={trackDriver}>Track Driver</button>
            </div>
          ))
        ) : (
          <p>No bookings available</p>
        )}
        <div className="create-booking-button">
          <button
            type="button"
            className="button"
            onClick={handleCreateBooking}
          >
            <span className="button__text">Add Item</span>
            <span className="button__icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                stroke="currentColor"
                height="24"
                fill="none"
                className="svg"
              >
                <line y2="19" y1="5" x2="12" x1="12"></line>
                <line y2="12" y1="12" x2="19" x1="5"></line>
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
