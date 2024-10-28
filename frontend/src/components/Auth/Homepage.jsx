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
      <Link to="/booking">Create Booking</Link>
      <br />
      <br />
      <Link to="/dashboard">Dashboard Page</Link>
      <br />
      <br />
      <Link to="/driver-dashboard">Driver Dashboard</Link>
      <br />
      <br />
      <Link to="/track-driver">Track Driver</Link>
    </div>
  );
}
