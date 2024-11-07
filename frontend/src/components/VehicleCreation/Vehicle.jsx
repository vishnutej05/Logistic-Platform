// VehicleCreation.js
import React, { useState } from "react";
import site from "../common/API";
import "./Vehicle.css";

export default function VehicleCreation() {
  const [vehicleData, setVehicleData] = useState({
    type: "",
    plateNumber: "",
    model: "",
    capacity: "",
    availability: true,
  });
  const [message, setMessage] = useState("");

  const getToken = () =>
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

  const handleChange = (e) => {
    setVehicleData({
      ...vehicleData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await site.post("/api/vehicle/create", vehicleData, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      console.log(response.data);
      setMessage("Vehicle created successfully!");
      setVehicleData({
        type: "",
        plateNumber: "",
        model: "",
        capacity: "",
        availability: true,
      });
    } catch (error) {
      console.error("Error creating vehicle:", error);
      setMessage("Failed to create vehicle.");
    }
  };

  return (
    <div className="vehicle-creation">
      <h3>Create Vehicle</h3>
      <form onSubmit={handleSubmit}>
        <input
          name="type"
          placeholder="Type (e.g., car)"
          value={vehicleData.type}
          onChange={handleChange}
          required
        />
        <input
          name="plateNumber"
          placeholder="Plate Number"
          value={vehicleData.plateNumber}
          onChange={handleChange}
          required
        />
        <input
          name="model"
          placeholder="Model"
          value={vehicleData.model}
          onChange={handleChange}
          required
        />
        <input
          name="capacity"
          type="number"
          placeholder="Capacity"
          value={vehicleData.capacity}
          onChange={handleChange}
          required
        />
        <div>
          <label>Available:</label>
          <input
            type="checkbox"
            name="availability"
            checked={vehicleData.availability}
            onChange={(e) =>
              setVehicleData({
                ...vehicleData,
                availability: e.target.checked,
              })
            }
          />
        </div>
        <button type="submit">Create Vehicle</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
