import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const submitIncidentReport = async (formData) => {
  const res = await axios.post(`${API_URL}incident-report`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });
  return res.data;
};

export const fetchAllIncidentReports = async () => {
  const res = await axios.get(`${API_URL}incident-report`, {
    withCredentials: true,
  });
  return res.data;
};

export const fetchIncidentReportsByUser = async (userId) => {
  const res = await axios.get(`${API_URL}incident-report/user/${userId}`, {
    withCredentials: true,
  });
  console.log("Fetched reports for user:", userId, res.data);
  return res.data;
};

export const updateIncidentStatus = async (id, status, actionTaken) => {
  const res = await axios.patch(
    `${API_URL}incident-report/${id}/status`,
    { status, actionTaken },
    { withCredentials: true }
  );
  return res.data;
};
