import React, { useState, useEffect } from "react";
import site from "../common/API";
import { useNavigate } from "react-router-dom";

export default function DriverSubmission() {
  const [visibility, setVisibility] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    licenseNumber: "",
    phone: "",
  });
  const [message, setMessage] = useState("");
  // const [submitted, setSubmitted] = useState(false);
  const [requestStatus, setRequestStatus] = useState("");

  const navigate = useNavigate();

  const getToken = () =>
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

  useEffect(() => {
    // Call the details API on page load to check requestStatus
    const fetchDriverDetails = async () => {
      try {
        const { data } = await site.get("/api/driver/details", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });

        console.log("Request Status:", data.requestStatus);
        setRequestStatus(data.requestStatus);

        if (data.requestStatus !== "pending") {
          navigate("/driver-dashboard");
        }
      } catch (error) {
        // console.error("Error fetching driver details:", error);
        setMessage(
          "You should submit your details to the admin before accepting rides"
        );
      }
    };

    fetchDriverDetails();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await site.post(
        "api/driver/submit-driver-request",
        formData,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      console.log(response.data);
      setMessage(
        "Thank you! Your request is submitted and awaiting admin approval."
      );
      setVisibility(false);
      // setSubmitted(true);
    } catch (error) {
      console.log("Error occurred:", error);
      if (error.response?.status === 400) {
        setMessage(error.response.data.message);
        return;
      }
      setMessage("Error submitting driver request. Please try again.");
    }
  };

  return (
    <div className="driver-certification">
      {requestStatus === "pending" ? (
        <div className="thank-you-card">
          <h2>Thank you for your submission!</h2>
          <p>
            Your request is being reviewed by an admin. You'll receive a
            response soon.
          </p>
        </div>
      ) : (
        <>
          {!visibility ? (
            <div className="certification-info">
              <h1>Become a Certified Driver</h1>
              <h2>Get certified by admin now</h2>
              <button onClick={() => setVisibility(true)}>Certify Here!</button>
              {message && <p>{message}</p>}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="driver-certification-form">
              <input
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                name="licenseNumber"
                placeholder="License Number"
                value={formData.licenseNumber}
                onChange={handleChange}
                required
              />
              <input
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <button type="submit">Submit for Approval</button>
              <button type="button" onClick={() => setVisibility(false)}>
                Cancel
              </button>
              {message && <p>{message}</p>}
            </form>
          )}
        </>
      )}
    </div>
  );
}
