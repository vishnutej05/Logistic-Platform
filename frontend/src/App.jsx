// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DriverTracking from "./components/DriverSideDetails/DriverTracking";
import CreateBooking from "./components/Booking/CreateBooking";
import LoginForm from "./components/Auth/LoginForm";
import DriverDashboard from "./components/DriverSideDetails/DriverDashboard"; // Import the DriverDashboard
import Homepage from "./components/Homepage"; // Import the Homepage component
import UserTracking from "./components/DriverUserSide/UserTrackingDriver";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/destination" element={<DriverTracking />} />
          <Route path="/booking" element={<CreateBooking />} />
          <Route path="/driver-dashboard" element={<DriverDashboard />} />
          <Route path="/track-driver" element={<UserTracking />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
