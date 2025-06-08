import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createGuideUploadDocu = async (guideId, documentData, file) => {
  try {
    const formData = new FormData();
    formData.append("document_type", documentData.document_type);
    formData.append("requirements", JSON.stringify(documentData.requirements));
    formData.append("file", file);

    const response = await axios.post(
      `${API_URL}guideUploadDocu/${guideId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(
        `Failed to create guide upload document. Server responded with status: ${response.status}`
      );
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error creating guide upload document:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const editGuideUploadDocu = async (docuId, documentData, file) => {
  try {
    const formData = new FormData();
    formData.append("document_type", documentData.document_type);
    formData.append("requirements", JSON.stringify(documentData.requirements));
    if (file) {
      formData.append("file", file);
    }

    const response = await axios.put(
      `${API_URL}guideUploadDocu/${docuId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(
        `Failed to edit guide upload document. Server responded with status: ${response.status}`
      );
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error editing guide upload document:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchGuideUploadDocuById = async (docuId) => {
  try {
    const response = await axios.get(`${API_URL}guideUploadDocu/${docuId}`);

    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch guide upload document. Server responded with status: ${response.status}`
      );
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching guide upload document:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createOperatorUploadDocu = async (
  operatorId,
  documentData,
  file
) => {
  try {
    const formData = new FormData();
    formData.append("document_type", documentData.document_type);
    formData.append("file", file);

    const response = await axios.post(
      `${API_URL}operatorUploadDocu/${operatorId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status !== 200) {
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

export const editOperatorUploadDocu = async (docuId, documentData, file) => {
  try {
    const formData = new FormData();
    formData.append("document_type", documentData.document_type);
    if (file) {
      formData.append("file", file);
    }

    const response = await axios.put(
      `${API_URL}operatorUploadDocu/${docuId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status !== 200) {
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

export const fetchOperatorUploadDocuById = async (docuId) => {
  try {
    const response = await axios.get(`${API_URL}operatorUploadDocu/${docuId}`);

    if (response.status !== 200) {
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
