import React from "react";
import { Link } from "react-router-dom";

export default function Homepage() {
  return (
    <div>
      <h1>Homepage</h1>
      <p>Current routes</p>
      <Link to="/login">Login Page</Link>
      <br />
      <br />
      <Link to="/user-dashboard">User Dashboard</Link>
      <br />
      <br />
      <Link to="/driver-dashboard">Driver Dashboard</Link>
      <br />
      <br />
      <Link to="/track-driver">Track Driver</Link>
      <br />
      <br />
      <Link to="/deliveryLocation">Delivery Location</Link>
      <br />
      <br />
    </div>
  );
}
