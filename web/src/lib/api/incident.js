import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Submit an incident report (with optional image)
export const submitIncidentReport = async (formData) => {
  const res = await axios.post(`${API_URL}incident-report`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });
  return res.data;
};

// Fetch all incident reports (requires tourism officer access)
export const fetchAllIncidentReports = async () => {
  const res = await axios.get(`${API_URL}incident-report`, {
    withCredentials: true,
  });
  return res.data;
};

// Fetch incident reports submitted by a specific user
export const fetchIncidentReportsByUser = async (userId) => {
  const res = await axios.get(`${API_URL}incident-report/user/${userId}`, {
    withCredentials: true,
  });
  return res.data;
};
