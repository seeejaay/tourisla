import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Upload a document for a guide
export const uploadGuideDocument = async (guideId, formData) => {
  try {
    console.log("Uploading guide document with formData:", formData);
    const response = await axios.post(
      `${API_URL}guideUploadDocu/${guideId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );
    console.log("Upload Response:", response);
    return response.data;
  } catch (error) {
    console.error("Error uploading guide document:", error);
    throw error;
  }
};

// Edit a guide's uploaded document
export const editGuideDocument = async (docuId, documentFile) => {
  try {
    const formData = new FormData();
    formData.append("document", documentFile);

    const response = await axios.put(
      `${API_URL}guideUploadDocu/${docuId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    if (response.status !== 200) {
      throw new Error(
        `Failed to edit guide document. Server responded with status: ${response.status}`
      );
    }
    return response.data;
  } catch (error) {
    console.error("Error editing guide document:", error);
    throw error;
  }
};

// Get a guide's uploaded document by document ID
export const getGuideDocumentById = async (docuId) => {
  try {
    const response = await axios.get(
      `${API_URL}guideUploadDocu/doc/${docuId}`,
      {
        withCredentials: true,
      }
    );

    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch guide document. Server responded with status: ${response.status}`
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching guide document:", error);
    throw error;
  }
};

// Get all uploaded documents by user ID
export const getGuideDocumentsByUserId = async (userId) => {
  try {
    const response = await axios.get(
      `${API_URL}guideUploadDocu/user/${userId}`,
      { withCredentials: true }
    );
    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch guide documents. Server responded with status: ${response.status}`
      );
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching guide documents:", error);
    throw error;
  }
};
