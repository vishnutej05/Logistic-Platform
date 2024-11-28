import axios from "axios";

// Create an Axios instance with default configurations
const site = axios.create({
  baseURL: "https://logistic-platform-backend.onrender.com/", // Adjust as needed
  headers: {
    "Content-Type": "application/json",
  },
});

export default site;
