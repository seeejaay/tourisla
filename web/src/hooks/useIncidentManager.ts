import { useState } from "react";
import {
  submitIncidentReport,
  fetchAllIncidentReports,
  fetchIncidentReportsByUser,
} from "@/lib/api/incident";

export function useIncidentManager() {
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);

  const submitReport = async (formData: FormData) => {
    setLoading(true);
    try {
      const response = await submitIncidentReport(formData);
      return response;
    } catch (error) {
      console.error("Failed to submit incident report:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getAllReports = async () => {
    try {
      const data = await fetchAllIncidentReports();
      console.log("Fetched incidents");
      setReports(data);
    } catch (error) {
      console.error("Failed to fetch incident reports:", error);
    }
  };

  const getMyReports = async (userId: number) => {
    try {
      const data = await fetchIncidentReportsByUser(userId);
      setReports(data);
    } catch (error) {
      console.error("Failed to fetch user incident reports:", error);
    }
  };

  return {
    loading,
    reports,
    submitReport,
    getAllReports,
    getMyReports,
  };
}
