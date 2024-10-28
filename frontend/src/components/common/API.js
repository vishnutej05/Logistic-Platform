import axios from "axios";

// Create an Axios instance with default configurations
const site = axios.create({
  baseURL: "http://localhost:5000/", // Adjust as needed
  headers: {
    "Content-Type": "application/json",
  },
});

export default site;
