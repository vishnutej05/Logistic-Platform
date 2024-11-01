import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import site from "../common/API";
import AppContext from "../../context/AppContext";
import "./UserDashboard.css";

export default function UserDashboard() {
  const [currentBookings, setCurrentBookings] = useState([]);
  const [previousBookings, setPreviousBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setbooking } = useContext(AppContext);
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
        const response = await site.get("/api/bookings/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        });

        const allBookings = response.data;
        setCurrentBookings(
          allBookings.filter((booking) => booking.updates !== "Delivered")
        );
        setPreviousBookings(
          allBookings.filter((booking) => booking.updates === "Delivered")
        );
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

  const trackDriver = (booking) => {
    setbooking(booking);
    navigate("/track-driver");
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">User Dashboard</h1>

      <section className="section">
        <h2>Current Bookings</h2>
        {loading ? (
          <p className="loading-text">Loading bookings...</p>
        ) : currentBookings.length > 0 ? (
          <div className="bookings-container">
            {currentBookings.map((booking) => (
              <div className="booking-card" key={booking._id}>
                <h3>Booking Details</h3>
                <div className="booking-detail">
                  <p>
                    <strong>Pickup:</strong> {booking.pickupLocation.address}
                  </p>
                  <p>
                    <strong>Dropoff:</strong> {booking.dropoffLocation.address}
                  </p>
                  <p>
                    <strong>Distance:</strong> {booking.distance} km
                  </p>
                  <p>
                    <strong>Driver:</strong> {booking.driver.name}
                  </p>
                  <p>
                    <strong>Price:</strong> ₹{booking.price}
                  </p>
                  <p>
                    <strong>Driver Updates:</strong> {booking.updates}
                  </p>
                </div>
                <button
                  className="track-btn"
                  onClick={() => trackDriver(booking)}
                >
                  Track Driver
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-bookings-text">No current bookings available</p>
        )}
      </section>

      <section className="section">
        <h2>Previous Bookings</h2>
        {previousBookings.length > 0 ? (
          <div className="bookings-container">
            {previousBookings.map((booking) => (
              <div className="booking-card" key={booking._id}>
                <h3>Booking Details</h3>
                <div className="booking-detail">
                  <p>
                    <strong>Pickup:</strong> {booking.pickupLocation.address}
                  </p>
                  <p>
                    <strong>Dropoff:</strong> {booking.dropoffLocation.address}
                  </p>
                  <p className="delivered-message">
                    Delivered. Please pay ₹{booking.price} to the admin.
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-bookings-text">No previous bookings available</p>
        )}
      </section>

      <div className="new-booking-button">
        <button className="create-btn" onClick={handleCreateBooking}>
          Create New Booking
        </button>
      </div>
    </div>
  );
}
