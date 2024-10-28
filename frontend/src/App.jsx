// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DeliveryLocation from "./components/DriverSideDetails/DeliveryLocation";
import UserDashboard from "./components/UserDashboard/UserDashboard";
import CreateBooking from "./components/Booking/CreateBooking";
import LoginForm from "./components/Auth/LoginForm";
import DriverRides from "./components/DriverSideDetails/DriverRides"; // Import the DriverDashboard
import Homepage from "./components/Auth/Homepage"; // Import the Homepage component
import UserTracking from "./components/UserSide/UserTrackingDriver";
import DriverDashboard from "./components/DriverDashboard/DriverDashboard";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/dashboard" element={<DriverDashboard />} />
          <Route path="/booking" element={<UserDashboard />} />
          <Route path="/create-booking" element={<CreateBooking />} />
          <Route path="/driver-dashboard" element={<DriverRides />} />
          <Route path="/track-driver" element={<UserTracking />} />
          <Route path="/deliveryLocation" element={<DeliveryLocation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
