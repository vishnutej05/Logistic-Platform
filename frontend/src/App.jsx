// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DeliveryLocation from "./components/DeliveryLocation/DeliveryLocation";
import UserDashboard from "./components/UserDashboard/UserDashboard";
import CreateBooking from "./components/Booking/CreateBooking";
import LoginForm from "./components/Auth/Login/LoginForm";
import Homepage from "./components/Auth/Homepage";
import UserTracking from "./components/UserTracking/UserTrackingDriver";
import DriverDashboard from "./components/DriverDashboard/DriverDashboard";
import { AppProvider } from "./context/AppContext";
import RegistrationPage from "./components/Auth/Register/RegistrationPage";
import Logout from "./components/Auth/Logout";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import DriverCreation from "./components/DriverSideDetails/DriverSubmission";

import AdminDashboardRe from "./AdminDashboard";
import ManageDriver from "./ManageDrivers";
import "./App.css";
function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/create-booking" element={<CreateBooking />} />
            <Route path="/track-driver" element={<UserTracking />} />
            <Route path="/driver-dashboard" element={<DriverDashboard />} />
            <Route path="/deliveryLocation" element={<DeliveryLocation />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/driver-create" element={<DriverCreation />} />
            <Route path="/logout" element={<Logout />} />

            <Route path="/admin" element={<AdminDashboardRe />} />
            <Route path="/admin/manage-drivers" element={<ManageDriver />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
