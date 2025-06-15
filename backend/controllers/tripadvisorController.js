const TRIPADVISOR_API_KEY = process.env.TRIP_ADVISOR_API_KEY;

const getTripadvisorHotels = async (req, res) => {
  try {
    const response = await fetch(
      `https://api.content.tripadvisor.com/api/v1/location/search?key=${TRIPADVISOR_API_KEY}&searchQuery=bantayan%20island&category=hotels`,
      {
        headers: {
          accept: "application/json",
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
    console.error("Error fetching Tripadvisor hotels:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getTriAdvisorPhotos = async (req, res) => {
  try {
    const response = await fetch(
      `https://api.content.tripadvisor.com/api/v1/location/${locationId}/photos?key=${TRIPADVISOR_API_KEY}`,
      {
        headers: {
          accept: "application/json",
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
    console.error("Error fetching Tripadvisor photos:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getTripadvisorHotelsWithPhotos = async (req, res) => {
  try {
    const hotelResponse = await fetch(
      `https://api.content.tripadvisor.com/api/v1/location/search?key=${TRIPADVISOR_API_KEY}&searchQuery=bantayan%20island&category=hotels`,
      {
        headers: {
          accept: "application/json",
        },
      }
    );
    if (!hotelResponse.ok) {
      const errorData = await hotelResponse.json();
      return res.status(hotelResponse.status).json({ error: errorData });
    }
    const hotelData = await hotelResponse.json();

    const hotelsWithPhotos = await Promise.all(
      hotelData.data.map(async (hotel) => {
        const photosResponse = await fetch(
          `https://api.content.tripadvisor.com/api/v1/location/${hotel.location_id}/photos?key=${TRIPADVISOR_API_KEY}`,
          {
            headers: {
              accept: "application/json",
            },
          }
        );
        if (!photosResponse.ok) {
          const errorData = await photosResponse.json();
          return { ...hotel, photosError: errorData };
        }
        const photosData = await photosResponse.json();
        return { ...hotel, photos: photosData.data };
      })
    );
    res.json(hotelsWithPhotos);
  } catch (error) {
    console.error("Error fetching Tripadvisor hotels with photos:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getTripadvisorHotels,
  getTripadvisorHotelsWithPhotos,
};
