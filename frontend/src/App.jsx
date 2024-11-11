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
import DriverSubmission from "./components/DriverSideDetails/DriverSubmission";
import AdminDashboardRe from "./components/AdminDashboard/AdminDashboard";
import ManageDriver from "./components/ManageDrivers/ManageDrivers";
import ManageVehicles from "./components/ManageVehicles/ManageVehicles";
import ManageBookings from "./components/ManageBookings/ManageBookings";
import ProtectedRoute from "./components/Auth/ProtectedRoute"; // Import the ProtectedRoute component

import "./App.css";

function App() {
  // Get the role from localStorage
  const role = localStorage.getItem("role");

  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/login" element={<LoginForm />} />

            {/* Protected Route for User */}
            {role === "user" && (
              <Route element={<ProtectedRoute requiredRole="user" />}>
                <Route path="/user-dashboard" element={<UserDashboard />} />
                <Route path="/create-booking" element={<CreateBooking />} />
                <Route path="/track-driver" element={<UserTracking />} />
                <Route path="/logout" element={<Logout />} />
              </Route>
            )}

            {/* Protected Route for Driver */}
            {role === "driver" && (
              <Route element={<ProtectedRoute requiredRole="driver" />}>
                <Route path="/driver-dashboard" element={<DriverDashboard />} />
                <Route
                  path="/deliveryLocation"
                  element={<DeliveryLocation />}
                />
                <Route path="/submit-details" element={<DriverSubmission />} />
                <Route path="/logout" element={<Logout />} />
              </Route>
            )}

            {/* Protected Route for Admin */}
            {role === "admin" && (
              <Route element={<ProtectedRoute requiredRole="admin" />}>
                <Route path="/admin" element={<AdminDashboardRe />} />
                <Route
                  path="/admin/manage-drivers"
                  element={<ManageDriver />}
                />
                <Route
                  path="/admin/manage-vehicles"
                  element={<ManageVehicles />}
                />
                <Route
                  path="/admin/manage-bookings"
                  element={<ManageBookings />}
                />
                <Route path="/logout" element={<Logout />} />
              </Route>
            )}
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
