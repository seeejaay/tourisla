// Mock attractions data for TripAdvisor API
export const mockAttractions = [
  {
    location_id: "mock1",
    name: "Local Historical Museum",
    description: "A fascinating museum showcasing local history and culture",
    web_url: "https://www.tripadvisor.com",
    rating: 4.5,
    num_reviews: 128,
    photo: {
      images: {
        medium: {
          url: "https://images.unsplash.com/photo-1582034986517-30d163aa1da9?w=500&auto=format&fit=crop"
        }
      }
    },
    category: { name: "Museum" }
  },
  {
    location_id: "mock2",
    name: "Beachside Restaurant",
    description: "Delicious seafood with ocean views",
    web_url: "https://www.tripadvisor.com",
    rating: 4.2,
    num_reviews: 85,
    photo: {
      images: {
        medium: {
          url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500&auto=format&fit=crop"
        }
      }
    },
    category: { name: "Restaurant" }
  },
  {
    location_id: "mock3",
    name: "Adventure Park",
    description: "Exciting outdoor activities for all ages",
    web_url: "https://www.tripadvisor.com",
    rating: 4.7,
    num_reviews: 203,
    photo: {
      images: {
        medium: {
          url: "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?w=500&auto=format&fit=crop"
        }
      }
    },
    category: { name: "Adventure" }
  },
  {
    location_id: "mock4",
    name: "Chocolate Hills Viewpoint",
    description: "Stunning views of the famous Chocolate Hills",
    web_url: "https://www.tripadvisor.com",
    rating: 4.8,
    num_reviews: 312,
    photo: {
      images: {
        medium: {
          url: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=500&auto=format&fit=crop"
        }
      }
    },
    category: { name: "Sightseeing" }
  },
  {
    location_id: "mock5",
    name: "Panglao Beach Resort",
    description: "Beautiful beachfront resort with excellent amenities",
    web_url: "https://www.tripadvisor.com",
    rating: 4.6,
    num_reviews: 178,
    photo: {
      images: {
        medium: {
          url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop"
        }
      }
    },
    category: { name: "Resort" }
  }
];

// Mock reviews data for TripAdvisor API
export const mockReviews = [
  {
    id: "mock_review_1",
    rating: 5,
    title: "Amazing experience!",
    text: "We had a wonderful time here. The staff was friendly and the exhibits were fascinating.",
    user: { username: "TravelLover22" },
    date: "2023-06-15"
  },
  {
    id: "mock_review_2",
    rating: 4,
    title: "Great place to visit",
    text: "Very informative and interesting. Would recommend to anyone visiting the area.",
    user: { username: "Wanderer123" },
    date: "2023-05-20"
  },
  {
    id: "mock_review_3",
    rating: 5,
    title: "Highlight of our trip",
    text: "This was the best part of our vacation. Don't miss it!",
    user: { username: "AdventureSeeker" },
    date: "2023-07-10"
  }
];