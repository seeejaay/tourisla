import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Apply as a tour guide to a tour operator
export const applyToTourOperator = async (
  tourguide_id,
  touroperator_id,
  reason_for_applying
) => {
  try {
    console.log("Applying to tour operator");
    const response = await axios.post(
      `${API_URL}applyToOperator`,
      { tourguide_id, touroperator_id, reason_for_applying },
      { withCredentials: true }
    );
    console.log("Application response");
    return response.data;
  } catch (error) {
    console.error("Error applying to tour operator:", error);
    throw error;
  }
};

// Get all applications for a tour operator
export const fetchApplicationsForTourOperator = async (operatorId) => {
  try {
    const response = await axios.get(`${API_URL}applications/${operatorId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching applications for tour operator:", error);
    throw error;
  }
};

// Approve a tour guide's application to a tour operator
export const approveTourGuideApplication = async (applicationId) => {
  try {
    const response = await axios.put(
      `${API_URL}applications/${applicationId}/approve`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error approving tour guide application:", error);
    throw error;
  }
};

// Reject a tour guide's application to a tour operator
export const rejectTourGuideApplication = async (applicationId) => {
  try {
    const response = await axios.put(
      `${API_URL}applications/${applicationId}/reject`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error rejecting tour guide application:", error);
    throw error;
  }
};
