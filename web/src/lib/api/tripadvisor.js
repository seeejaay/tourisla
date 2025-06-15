const API_URL = process.env.NEXT_PUBLIC_API_URL2;

export const fetchTripadvisorHotels = async () => {
  try {
    const response = await fetch(`${API_URL}tripadvisor/hotels`);
    if (!response.ok) {
      throw new Error("Failed to fetch hotels from Tripadvisor");
    }
    const data = await response.json();
    console.log("Fetched Tripadvisor hotels data:", data);
    // If your backend returns an array directly:
    return Array.isArray(data) ? data : data.data;
  } catch (error) {
    console.error("Tripadvisor API error:", error);
    throw error;
  }
};
