import React from "react";
import DriverLocation from "../DriverSideDetails/DriverLocation";
import DriverRides from "../DriverSideDetails/DriverRides";
import "./DriverDashboard.css"; // Import the CSS file for styling

export default function DriverDashboard() {
  return (
    <div className="driver-dashboard-container">
      <div className="driver-location">
        <DriverLocation />
      </div>

      <div className="main-dashboard">
        <DriverRides />
      </div>
    </div>
  );
}
