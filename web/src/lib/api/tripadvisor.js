const API_URL = process.env.NEXT_PUBLIC_API_URL2;

const fetchTripadvisorHotels = async () => {
  try {
    const response = await fetch(`${API_URL}hotels`);

    if (!response.ok) {
      throw new Error("Failed to fetch hotels from Tripadvisor");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Tripadvisor API error:", error);
    throw error;
  }
};
export default fetchTripadvisorHotels;
