import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const exportVisitorLogs = async (params) => {
  try {
    const response = await axios.get(
      `${API_URL}visitor-logs/export`,
      {
        params: {
          from: params.from,
          to: params.to,
          tourist_spot_id: params.tourist_spot_id,
        },
        responseType: "blob", // Important for file download
      },
      { withCredentials: true }
    );
    return response.data; // This will be the file buffer (blob)
  } catch (error) {
    console.error("Error exporting visitor logs:", error);
    throw error;
  }
};

export const exportVisitorLogsSummary = async (params) => {
  try {
    const response = await axios.get(
      `${API_URL}visitor-summary/export`,
      {
        params: {
          from: params.from,
          to: params.to,
          tourist_spot_id: params.tourist_spot_id,
        },
        responseType: "blob", // Important for file download
      },
      { withCredentials: true }
    );
    return response.data; // This will be the file buffer (blob)
  } catch (error) {
    console.error("Error exporting visitor logs summary:", error);
    throw error;
  }
};

export const getVisitorLogsWithSpotName = async () => {
  try {
    const response = await axios.get(`${API_URL}visitor-logs`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching visitor logs with spot name:", error);
    throw error;
  }
};
