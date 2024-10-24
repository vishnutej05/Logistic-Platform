import React, { useEffect, useState } from "react";
import axios from "../common/API";
import "./DriverRides.css";

const DriverDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(null); // To store current booking details

  // Function to get the JWT token from cookies
  const getToken = () =>
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

  // Fetch available bookings
  const fetchAvailableBookings = async () => {
    try {
      const { data } = await axios.get("/driver/available-bookings", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setBookings(data);
    } catch (error) {
      console.error(
        "Error fetching available bookings",
        error.response.data,
        error.response.status
      );
    }
  };

  // Fetch current booking details after accepting
  const fetchCurrentBooking = async () => {
    try {
      const { data } = await axios.get("/driver/current-bookings", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      // console.log(data[0].distance);

      const details = {
        pickupAddress: data[0].pickupLocation.address,
        dropoffAddress: data[0].dropoffLocation.address,
        distance: data[0].distance,
        price: data[0].price,
      };

      // console.log("These are my details of current booking", details);
      setCurrentBooking(details); // Store the current booking details
    } catch (error) {
      if (error.response?.status === 404) {
        // No current booking, fetch available bookings
        fetchAvailableBookings();
      } else {
        console.error(
          "Error fetching current booking",
          error.response.data,
          error.response.status
        );
      }
    }
  };

  // Handle accepting a booking
  const handleAcceptBooking = async (bookingId) => {
    try {
      const { status } = await axios.post(
        `/driver/accept-booking/${bookingId}`,
        {},
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      if (status === 200) {
        alert("Booking accepted!");
        fetchCurrentBooking(); // Fetch current booking once accepted
      }
    } catch (error) {
      alert("Failed to accept booking.");
    }
  };

  // Fetch current booking on component mount
  // eslint-disable-next-line
  useEffect(() => {
    fetchCurrentBooking(); // Always attempt to get current booking first
  }, []);
  // Render the current booking if one is active
  if (currentBooking) {
    const { pickupAddress, dropoffAddress, price, distance } = currentBooking;
    // console.log("Current Booking", currentBooking);
    return (
      <div>
        <h2>Current Booking</h2>
        <p>Pickup: {pickupAddress || "Not available"}</p>
        <p>Dropoff: {dropoffAddress || "Not available"}</p>
        <p>Distance: {distance} km</p>
        <p>Price: ₹{price}</p>
        <button>View Details</button>
        {/* when clicked on this it should redirect to maps and should shot destination on maps and style this buytton */}
      </div>
    );
  }

  // Render available bookings if no current booking
  return (
    <div>
      <h2>Driver Dashboard</h2>
      {bookings.length === 0 ? (
        <p>No available bookings at the moment.</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking._id} className="booking-card">
            <h3>{booking.user?.name || "Unknown User"}</h3>
            <p>Pickup: {booking.pickupLocation?.address || "Not available"}</p>
            <p>Drop: {booking.dropoffLocation?.address || "Not available"}</p>
            <p>Distance: {booking.distance} km</p>
            <p>Price: {booking.price} </p>
            <button onClick={() => handleAcceptBooking(booking._id)}>
              Accept
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default DriverDashboard;
