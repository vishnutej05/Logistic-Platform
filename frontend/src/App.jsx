// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DriverTracking from "./components/DriverTracking";
import CreateBooking from "./components/CreateBooking";
import LoginForm from "./components/Login";
function App() {
  return (
    <Router>
      <div className="App">
        <h1>Logistic Platform - Real-Time Driver Tracking</h1>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/driver" element={<DriverTracking />} />
          <Route path="/booking" element={<CreateBooking />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
