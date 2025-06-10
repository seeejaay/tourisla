import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const fetchTouristSpots = async () => {
  try {
    console.log(`Fetching tourist spots from: ${API_URL}tourist-spots`);
    
    const response = await axios.get(`${API_URL}tourist-spots`, {
      withCredentials: true,
    });

    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    
    console.log('Tourist spots fetch successful');
    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching Tourist Spots: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchTouristSpotById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}tourist-spots/${id}`, {
      withCredentials: true,
    });

    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    
    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching Tourist Spot: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createTouristSpot = async (touristSpotData, token) => {
  try {
    const response = await axios.post(
      `${API_URL}tourist-spots`,
      touristSpotData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error Creating Tourist Spot: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateTouristSpot = async (touristSpotId, touristSpotData, token) => {
  try {
    const response = await axios.put(
      `${API_URL}tourist-spots/${touristSpotId}`,
      touristSpotData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error Updating Tourist Spot: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteTouristSpot = async (touristSpotId, token) => {
  try {
    const response = await axios.delete(
      `${API_URL}tourist-spots/${touristSpotId}`,
      {
        withCredentials: true,
        headers: {
          "Authorization": `Bearer ${token}`
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error Deleting Tourist Spot: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Use mock data if API is unavailable
export const getMockTouristSpots = () => {
  return [
    {
      id: 1,
      name: "Chocolate Hills",
      description: "The Chocolate Hills are a geological formation in the Bohol province of the Philippines. They are a famous tourist attraction of Bohol.",
      type: "NATURAL",
      barangay: "Buenos Aires",
      municipality: "Carmen",
      images: [
        { image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Chocolate_Hills_overview.JPG/1200px-Chocolate_Hills_overview.JPG" }
      ]
    },
    {
      id: 2,
      name: "Panglao Island",
      description: "Panglao is a popular tourist destination in the Philippines, and is well known for its white sand beaches and diving locations.",
      type: "BEACH",
      barangay: "Danao",
      municipality: "Panglao",
      images: [
        { image_url: "https://a.cdn-hotels.com/gdcs/production143/d1112/c4fedab1-4041-4db4-9d0e-a64701588c54.jpg" }
      ]
    },
    {
      id: 3,
      name: "Baclayon Church",
      description: "The Church of Our Lady of the Immaculate Conception, commonly known as Baclayon Church, is a historic church in Bohol, Philippines.",
      type: "HISTORICAL",
      barangay: "Baclayon",
      municipality: "Baclayon",
      images: [
        { image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Baclayon_Church_Bohol.jpg/1200px-Baclayon_Church_Bohol.jpg" }
      ]
    }
  ];
};


