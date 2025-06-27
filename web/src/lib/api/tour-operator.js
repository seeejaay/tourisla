import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Fetch all operator applicants
export const fetchTourOperatorApplicants = async () => {
  try {
    const response = await axios.get(`${API_URL}operatorRegis`, {
      withCredentials: true,
    });
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching Tour Operator Applicants: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fetch one operator applicant by ID
export const fetchTourOperatorApplicant = async (operatorId) => {
  try {
    console.log("Fetching Tour Operator Applicant with ID");
    const response = await axios.get(`${API_URL}operatorRegis/${operatorId}`, {
      withCredentials: true,
    });
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching Tour Operator Applicant: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Create operator applicant (with file upload support)
export const createTourOperatorApplicant = async (operatorData) => {
  try {
    console.log("Creating Tour Operator Applicant with data");
    const response = await axios.post(`${API_URL}operatorRegis`, operatorData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error(
      "Error Creating Tour Operator Applicant: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Edit operator applicant (with file upload support)
export const editTourOperatorApplicant = async (operatorId, operatorData) => {
  try {
    const formData = new FormData();
    for (const key in operatorData) {
      if (operatorData[key] !== undefined && operatorData[key] !== null) {
        if (key === "profile_picture" && operatorData[key] instanceof File) {
          formData.append(key, operatorData[key]);
        } else {
          formData.append(key, operatorData[key]);
        }
      }
    }
    const response = await axios.put(
      `${API_URL}operatorRegis/${operatorId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error(
      "Error Editing Tour Operator Applicant: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Delete operator applicant
export const deleteTourOperatorApplicant = async (operatorId) => {
  try {
    const response = await axios.delete(
      `${API_URL}operatorRegis/${operatorId}`,
      {
        withCredentials: true,
      }
    );
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error(
      "Error Deleting Tour Operator Applicant: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Document Uploads
export const fetchOperatorUploadDocuById = async (docuId) => {
  try {
    const response = await axios.get(`${API_URL}operatorUploadDocu/${docuId}`, {
      withCredentials: true,
    });
    if (response.status < 200 || response.status >= 300) {
      throw new Error(
        `Failed to fetch operator upload document. Server responded with status: ${response.status}`
      );
    }
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching operator upload document:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createOperatorUploadDocu = async (operatorId, formData) => {
  try {
    const response = await axios.post(
      `${API_URL}operatorUploadDocu/${operatorId}`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.status < 200 || response.status >= 300) {
      throw new Error(
        `Failed to create operator upload document. Server responded with status: ${response.status}`
      );
    }
    return response.data;
  } catch (error) {
    console.error(
      "Error creating operator upload document:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const editOperatorUploadDocu = async (docuId, formData) => {
  try {
    const response = await axios.put(
      `${API_URL}operatorUploadDocu/${docuId}`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.status < 200 || response.status >= 300) {
      throw new Error(
        `Failed to edit operator upload document. Server responded with status: ${response.status}`
      );
    }
    return response.data;
  } catch (error) {
    console.error(
      "Error editing operator upload document:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Admin Verification of Tour Operator Applicants

export const fetchAllTourOperatorApplicants = async () => {
  try {
    const response = await axios.get(`${API_URL}operatorApplicants`, {
      withCredentials: true,
    });
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching All Tour Operator Applicants: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchOneTourOperatorApplicant = async (applicantId) => {
  try {
    const response = await axios.get(
      `${API_URL}operatorApplicants/${applicantId}`,
      {
        withCredentials: true,
      }
    );
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching One Tour Operator Applicant: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const approveTourOperatorApplicant = async (applicantId) => {
  try {
    const response = await axios.put(
      `${API_URL}operatorApplicants/${applicantId}/approve`,
      {},
      {
        withCredentials: true,
      }
    );
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error(
      "Error Approving Tour Operator Applicant: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const rejectTourOperatorApplicant = async (applicantId) => {
  try {
    const response = await axios.put(
      `${API_URL}operatorApplicants/${applicantId}/reject`,
      {},
      {
        withCredentials: true,
      }
    );
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error(
      "Error Rejecting Tour Operator Applicant: ",
      error.response?.data || error.message
    );
    throw error;
  }
};
