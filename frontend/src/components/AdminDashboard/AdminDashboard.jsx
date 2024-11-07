import React, { useState, useEffect } from "react";
import site from "../common/API";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function AdminDashboard() {
  const [showRequests, setShowRequests] = useState(false);
  const [driverRequests, setDriverRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const getToken = () =>
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

  const fetchDriverRequests = async () => {
    try {
      const response = await site.get("/api/admin/driver-requests", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setDriverRequests(response.data);
    } catch (error) {
      console.error("Error fetching driver requests:", error);
      setMessage("Failed to load driver requests.");
    }
  };

  const handleApproveReject = async (driverId, action) => {
    try {
      const response = await site.patch(
        `/api/admin/approve-driver-request/${driverId}`,
        { action },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      fetchDriverRequests();
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error approving/rejecting request:", error);
      setMessage("Failed to approve or reject the driver request.");
    }
  };

  const handleShowRequests = () => {
    if (!showRequests) {
      fetchDriverRequests();
    }
    setShowRequests((prev) => !prev);
  };

  return (
    <div className="admin-dashboard">
      <h2>Manage Driver Fleet</h2>

      <div className="driver-requests-card">
        <button className="toggle-requests-button" onClick={handleShowRequests}>
          {showRequests ? "Hide Requests" : "View Requests"}
        </button>
        {message && <p className="message-text">{message}</p>}
        {showRequests && (
          <div className="requests-list">
            {driverRequests.length > 0 ? (
              driverRequests.map((request) => (
                <div key={request._id} className="request-card">
                  <h4 className="request-name">{request.name}</h4>
                  <p className="request-info">
                    License: {request.licenseNumber}
                  </p>
                  <p className="request-info">Phone: {request.phone}</p>
                  <p className="request-date">
                    Submitted on:{" "}
                    {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                  <div className="actions">
                    <button
                      className="approve-button"
                      onClick={() =>
                        handleApproveReject(request._id, "approve")
                      }
                    >
                      Approve
                    </button>
                    <button
                      className="reject-button"
                      onClick={() => handleApproveReject(request._id, "reject")}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-requests">No driver requests available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
