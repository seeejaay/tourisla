export interface TouristSpotImage {
  id: number;
  tourist_spot_id: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface TouristSpot {
  id: number;
  name: string;
  description: string;
  location: string;
  type: string;
  municipality: string;
  province: string;
  images?: TouristSpotImage[];
  created_at: string;
  opening_time?: string;
  closing_time?: string;
  entrance_fee?: string;
  days_open?: string;
}

