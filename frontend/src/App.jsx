// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DeliveryLocation from "./components/DeliveryLocation/DeliveryLocation";
import UserDashboard from "./components/UserDashboard/UserDashboard";
import CreateBooking from "./components/Booking/CreateBooking";
import LoginForm from "./components/Auth/Login/LoginForm";
// import DriverRides from "./components/DriverSideDetails/DriverRides"; // Import the DriverDashboard
import Homepage from "./components/Auth/Homepage"; // Import the Homepage component
import UserTracking from "./components/UserTracking/UserTrackingDriver";
import DriverDashboard from "./components/DriverDashboard/DriverDashboard";
import { AppProvider } from "./context/AppContext";
import RegistrationPage from "./components/Auth/Register/RegistrationPage";
import Logout from "./components/Auth/Logout";
import "./App.css";
function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/driver-dashboard" element={<DriverDashboard />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/create-booking" element={<CreateBooking />} />
            {/* <Route path="/driver-dashboard" element={<DriverRides />} /> */}
            <Route path="/track-driver" element={<UserTracking />} />
            <Route path="/deliveryLocation" element={<DeliveryLocation />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
