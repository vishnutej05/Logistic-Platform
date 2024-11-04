import React, { useEffect, useState } from "react";
import DriverLocation from "../DriverSideDetails/DriverLocation";
import DriverRides from "../DriverSideDetails/DriverRides";
import site from "../common/API";
import "./DriverDashboard.css"; // Import the CSS file for styling

export default function DriverDashboard() {
  const [rides, setRides] = useState([]);
  // const navigate = useNavigte();
  const getToken = () => {
    const tokenString = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    return tokenString ? tokenString.split("=")[1] : null;
  };

  const redirect = () => {
    alert("Yet to be implemented will implement after implementing admin side");
    // navigate("/homepage");
  };

  useEffect(() => {
    const fetchPastRides = async () => {
      try {
        const response = await site.get("/api/bookings/completed-bookings/", {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        console.log("Fetched past rides:", response.data[0]);
        setRides(response.data);
      } catch (error) {
        console.error("Error setting up request:", error.message);
      }
    };

    fetchPastRides();
  }, []);

  return (
    <div className="driver-dashboard-container">
      <div className="header">
        <h1 className="main-title">Driver Dashboard</h1>
        <div>
          <DriverLocation />
        </div>
      </div>

      <div className="booking-card">
        <h2>Past Bookings</h2>
        {rides.length === 0 ? (
          <p>You have not completed any rides!</p>
        ) : (
          rides.map((ride) => (
            <div key={ride._id}>
              <p>
                <strong>Pickup Location:</strong> {ride.pickupLocation.address}
              </p>
              <p>
                <strong>Dropoff Location:</strong>{" "}
                {ride.dropoffLocation.address}
              </p>

              <p>
                <strong>Booking Created:</strong>{" "}
                {new Date(ride.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Order Delivered:</strong>{" "}
                {new Date(ride.updatedAt).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong> {ride.status}
              </p>
              <p>
                <strong>Distance:</strong> {ride.distance} km
              </p>
              <p className="delivered-message">
                Delivered. Please Collect ₹{ride.price} from the admin.
              </p>
              <button className="create-btn" onClick={redirect}>
                Pay Now
              </button>
            </div>
          ))
        )}
      </div>

      <div className="main-dashboard">
        <DriverRides />
      </div>
    </div>
  );
}
