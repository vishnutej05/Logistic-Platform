import axios from "axios";

// Create an Axios instance with default configurations
const instance = axios.create({
  baseURL: "http://localhost:5000/api", // Adjust as needed
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
