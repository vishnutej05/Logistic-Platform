import React, { useState, useEffect } from "react";
import site from "../common/API"; // Make sure axios is set up here

export default function AdminDashboard() {
  const [showRequests, setShowRequests] = useState(false);
  const [driverRequests, setDriverRequests] = useState([]);
  const [message, setMessage] = useState("");

  const getToken = () =>
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

  // Fetch driver submissions when the button is clicked
  const fetchDriverRequests = async () => {
    try {
      const response = await site.get("/api/admin/driver-requests", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      console.log(response);
      setDriverRequests(response.data);
    } catch (error) {
      console.error("Error fetching driver requests:", error);
      setMessage("Failed to load driver requests.");
    }
  };

  // Handle approve/reject driver request
  const handleApproveReject = async (driverId, action) => {
    try {
      const response = await site.patch(
        `/api/admin/approve-driver-request/${driverId}`,
        { action },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      console.log(response.data.message);
      // After action, refetch the driver requests
      fetchDriverRequests();
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error approving/rejecting request:", error);
      setMessage("Failed to approve or reject the driver request.");
    }
  };

  const handleShowRequests = () => {
    if (!showRequests) {
      fetchDriverRequests(); // Fetch only if not already showing
    }
    setShowRequests((prev) => !prev);
  };

  return (
    <div className="admin-dashboard">
      <div className="driver-requests-card">
        <h2>Driver Requests</h2>
        <button onClick={handleShowRequests}>
          {showRequests ? "Hide Requests" : "View Requests"}
        </button>
        {message && <p>{message}</p>}
        {showRequests && (
          <div className="requests-list">
            {driverRequests.length > 0 ? (
              driverRequests.map((request) => (
                <div key={request._id} className="request-card">
                  <h4>{request.name}</h4>
                  <p>License: {request.licenseNumber}</p>
                  <p>Phone: {request.phone}</p>
                  <p>
                    Submitted on:{" "}
                    {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                  <div className="actions">
                    <button
                      onClick={() =>
                        handleApproveReject(request._id, "approve")
                      }
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleApproveReject(request._id, "reject")}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No driver requests available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
