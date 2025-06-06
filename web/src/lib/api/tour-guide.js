import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchTourGuideApplicants = async () => {
  try {
    const response = await axios.get(`${API_URL}guideRegis`, {
      withCredentials: true,
    });

    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching Tour Guide Applicants: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchTourGuideApplicant = async (guideId) => {
  try {
    const response = await axios.get(`${API_URL}guideRegis/${guideId}`, {
      withCredentials: true,
    });

    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching Tour Guide Applicant: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createTourGuideApplicant = async (guideData) => {
  try {
    const formData = new FormData();
    for (const key in guideData) {
      if (guideData[key] !== undefined && guideData[key] !== null) {
        // If it's a file, append as file, else as string
        if (key === "profile_picture" && guideData[key] instanceof File) {
          formData.append(key, guideData[key]);
        } else {
          formData.append(key, guideData[key]);
        }
      }
    }
    const response = await axios.post(`${API_URL}guideRegis`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error(
      "Error Creating Tour Guide Applicant: ",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const editTourGuideApplicant = async (guideId, guideData) => {
  try {
    const response = await axios.put(
      `${API_URL}guideRegis/${guideId}`,
      guideData,
      {
        withCredentials: true,
      }
    );
    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error(
      "Error Editing Tour Guide Applicant: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteTourGuideApplicant = async (guideId) => {
  try {
    const response = await axios.delete(`${API_URL}guideRegis/${guideId}`, {
      withCredentials: true,
    });

    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error Deleting Tour Guide Applicant: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

//Document Uploads
export const fetchTourGuideDocument = async (documentId) => {
  try {
    const response = await axios.get(
      `${API_URL}guideUploadDocu/${documentId}`,
      {
        withCredentials: true,
      }
    );
    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching Tour Guide Document: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const uploadTourGuideDocument = async (guideId, formData) => {
  try {
    const response = await axios.post(
      `${API_URL}guideUploadDocu/${guideId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );

    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error Uploading Tour Guide Document: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const editTourGuideDocument = async (documentId, formData) => {
  try {
    const response = await axios.put(
      `${API_URL}guideUploadDocu/${documentId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );

    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error Editing Tour Guide Document: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

//Verify of Tour Guide Applicants

export const fetchAllTourGuideApplicants = async () => {
  try {
    const response = await axios.get(`${API_URL}guideApplicants`, {
      withCredentials: true,
    });

    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching All Tour Guide Applicants: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchOneTourGuideApplicant = async (applicantId) => {
  try {
    const response = await axios.get(
      `${API_URL}guideApplicants/${applicantId}`,
      {
        withCredentials: true,
      }
    );

    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching One Tour Guide Applicant: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const approveTourGuideApplicant = async (applicantId) => {
  try {
    const response = await axios.put(
      `${API_URL}guideApplicants/${applicantId}/approve`,
      {},
      {
        withCredentials: true,
      }
    );

    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error Approving Tour Guide Applicant: ",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const rejectTourGuideApplicant = async (applicantId) => {
  try {
    const response = await axios.put(
      `${API_URL}guideApplicants/${applicantId}/reject`,
      {},
      {
        withCredentials: true,
      }
    );

    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error Rejecting Tour Guide Applicant: ",
      error.response?.data || error.message
    );
    throw error;
  }
};
