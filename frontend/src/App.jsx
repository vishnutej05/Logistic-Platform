// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DriverTracking from "./components/DriverLocation";
import UserTracking from "./components/UserTrackingDriver";

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Real-Time Tracking App</h1>
        <Routes>
          <Route path="/driver" element={<DriverTracking />} />
          <Route path="/user" element={<UserTracking />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
