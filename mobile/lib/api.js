import axios from "axios";

// Set the base URL to your local backend server
const API_BASE_URL = "http://192.168.0.130:5000"; // Replace with your IP

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // Optional: Set timeout for requests
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
