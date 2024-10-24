// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import DriverLocation from "./components/DriverSideDetails/DriverLocation";
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
          <Route path="/destination" element={<DriverDashboard />} />
          <Route path="/booking" element={<CreateBooking />} />
          <Route path="/driver-dashboard" element={<DriverRides />} />
          <Route path="/track-driver" element={<UserTracking />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
