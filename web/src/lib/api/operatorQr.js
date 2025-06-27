import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const uploadOperatorQr = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}operator-qr`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true, // Ensure cookies are sent with the request
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading operator QR:", error);
    throw error;
  }
};

export const getOperatorQrById = async (touroperator_id) => {
  try {
    console.log("Fetching QR codes for Tour Operator ID");
    const response = await axios.get(
      `${API_URL}operator-qr/${touroperator_id}`,
      {
        withCredentials: true, // Ensure cookies are sent with the request
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching operator QR codes:", error);
    throw error;
  }
};
