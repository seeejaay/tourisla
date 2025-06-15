const TRIPADVISOR_API_KEY = process.env.TRIP_ADVISOR_API_KEY;
const locationId = 1218897;

const getTripadvisorLocation = async (req, res) => {
  try {
    const response = await fetch(
      `https://api.tripadvisor.com/api/partner/2.0/location/1218897/details`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-TripAdvisor-API-Key": TRIPADVISOR_API_KEY,
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching Tripadvisor location:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getTripadvisorLocation,
};
