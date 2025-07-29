import { useState } from "react";
import {
  submitIncidentReport,
  fetchAllIncidentReports,
  fetchIncidentReportsByUser,
  updateIncidentStatus,
} from "@/lib/api/incident";
export interface IncidentReport {
  id: number;
  submitted_by: number | null;
  role: string;
  incident_type: string;
  location: string;
  incident_date: string;
  incident_time: string;
  description: string;
  photo_url: string | null;
  submitted_at: string | null;
  status: "RECEIVED" | "RESOLVED" | "ARCHIVED";
}

export function useIncidentManager() {
  const [loading, setLoading] = useState<boolean>(false);
  const [reports, setReports] = useState<IncidentReport[]>([]);

  const submitReport = async (formData: FormData): Promise<IncidentReport> => {
    setLoading(true);
    try {
      const response: IncidentReport = await submitIncidentReport(formData);
      return response;
    } catch (error) {
      console.error("Failed to submit incident report:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getAllReports = async (): Promise<void> => {
    try {
      const data: IncidentReport[] = await fetchAllIncidentReports();
      setReports(data);
    } catch (error) {
      console.error("Failed to fetch incident reports:", error);
    }
  };

  const getMyReports = async (userId: number): Promise<void> => {
    try {
      const data: IncidentReport[] = await fetchIncidentReportsByUser(userId);
      setReports(data);
    } catch (error) {
      console.error("Failed to fetch user incident reports:", error);
    }
  };

  const changeStatus = async (
    id: number,
    status: "RECEIVED" | "RESOLVED" | "ARCHIVED",
    actionTaken?: string
  ): Promise<IncidentReport> => {
    try {
      setLoading(true);
      const updated: { report: IncidentReport } = await updateIncidentStatus(
        id,
        status,
        actionTaken
      );
      setReports((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: updated.report.status } : r
        )
      );
      return updated.report;
    } catch (error) {
      console.error("Failed to update incident status:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    reports,
    submitReport,
    getAllReports,
    getMyReports,
    changeStatus,
  };
}
