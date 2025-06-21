// tourGuideAssignments.js
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.0.135:3005";

const getApiUrl = (endpoint) => {
  const baseUrl = API_URL.endsWith("/") ? API_URL.slice(0, -1) : API_URL;
  const apiPrefix = baseUrl.includes("/api/v1") ? "" : "/api/v1";
  return `${baseUrl}${apiPrefix}/${endpoint}`;
};

const logApiRequest = (method, url) => {
  console.log(`API Request: ${method} ${url}`);
};

export const fetchGuidePackages = async (userId) => {
  try {
    logApiRequest("GET", "tourguide_assignments/user/" + userId);
    const url = getApiUrl(`tourguide_assignments/user/${userId}`); // <-- Backend must support this endpoint
    const response = await axios.get(url, { withCredentials: true, timeout: 10000 });

    if (response.status !== 200) {
      throw new Error(`Error: status ${response.status}`);
    }

    return response.data; // this returns an array of tour packages
  } catch (error) {
    console.error(
      "Error Fetching Guide's Packages: ",
      error.message || error
    );
    throw error;
  }
};
