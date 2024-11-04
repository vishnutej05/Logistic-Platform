import React, { useEffect, useState } from "react";
import site from "../common/API";
import { useNavigate } from "react-router-dom";

const DriverDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(null); // To store current booking details
  const [rideCompleted, setRideCompleted] = useState(false); // State to track if ride is completed
  const navigate = useNavigate();

  // Function to get the JWT token from cookies
  const getToken = () =>
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

  // Fetch available bookings
  const fetchAvailableBookings = async () => {
    try {
      const { data } = await site.get("/api/bookings/available-bookings", {
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
      const { data } = await site.get("/api/bookings/current-bookings", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      console.log(data[0]);

      const details = {
        pickupAddress: data[0].pickupLocation.address,
        pickupCords: data[0].pickupLocation.coordinates,
        dropoffCords: data[0].dropoffLocation.coordinates,
        dropoffAddress: data[0].dropoffLocation.address,
        distance: data[0].distance,
        price: data[0].price,
        createdAt: data[0].createdAt,
        id: data[0]._id,
        updates: data[0].updates,
      };

      // Check if ride is completed
      if (details.updates === "Delivered") {
        setRideCompleted(true); // Set ride completed status
      }

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
      const { status } = await site.post(
        `api/driver/accept-booking/${bookingId}`,
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

  const handleViewDetails = (booking) => {
    // console.log("when clicked on view details", booking);
    navigate("/deliveryLocation", {
      state: { booking },
    });
  };

  useEffect(() => {
    fetchCurrentBooking(); // Always attempt to get current booking first
  }, []);

  // Render congratulatory card if the ride is completed
  if (rideCompleted) {
    return (
      <div className="completed-ride-card">
        <h2>Congratulations!</h2>
        <p>You have completed this ride. Thank you for delivering the goods!</p>
      </div>
    );
  }

  if (currentBooking) {
    const { pickupAddress, dropoffAddress, price, distance } = currentBooking;
    return (
      <div className="current-booking">
        <h2 className="bookings">Current Booking</h2>
        <p>
          <strong>Pickup:</strong> {pickupAddress || "Not available"}
        </p>
        <p>
          <strong>Dropoff:</strong> {dropoffAddress || "Not available"}
        </p>
        <p>
          <strong>Distance:</strong> {distance} km
        </p>
        <p>
          <strong>Price:</strong> ₹{price}
        </p>
        <button onClick={() => handleViewDetails(currentBooking)}>
          View Details
        </button>
      </div>
    );
  }

  // Render available bookings if no current booking
  return (
    <div>
      <h2 className="bookings">Booking Request</h2>
      {bookings.length === 0 ? (
        <p>No available bookings at the moment.</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking._id} className="booking-card">
            {/* <p>{booking.user?.name || "Unknown User"}</p> */}
            <p>
              <strong>Pickup:</strong>{" "}
              {booking.pickupLocation?.address || "Not available"}
            </p>
            <p>
              <strong>Drop:</strong>{" "}
              {booking.dropoffLocation?.address || "Not available"}
            </p>
            <p>
              <strong>Distance:</strong> {booking.distance} km
            </p>
            <p>
              <strong>Price:</strong> {booking.price}
            </p>
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
