import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Fetch feedback for a specific entity (operator, guide, spot, etc)
 * @param {Object} params
 * @param {string} params.type - Type of entity: 'OPERATOR', 'GUIDE', etc.
 * @param {number|string} params.ref_id - The id of the entity (operator id, guide id, etc)
 */
export const fetchFeedbackForEntity = async ({ type, ref_id }) => {
  const res = await axios.get(`${API_URL}feedback/entity`, {
    params: { type, ref_id },
    withCredentials: true,
  });
  return res.data;
};

/**
 * Fetch operator applicant by user ID
 * @param {string|number} userId - The user ID to fetch the operator applicant for
 */
export const fetchOperatorApplicantByUserId = async (userId) => {
  const res = await axios.get(`${API_URL}operator-applicants/by-user/${userId}`, {
    withCredentials: true,
  });
  return res.data;
};
