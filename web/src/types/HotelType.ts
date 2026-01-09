export interface PhotoImage {
  height: number;
  width: number;
  url: string;
}

export interface Photo {
  id: number;
  caption: string;
  images: {
    large: PhotoImage;
  };
}

export interface Hotel {
  location_id: string;
  name: string;
  address_obj: {
    street1?: string;
    street2?: string;
    address_string: string;
  };
  photos: Photo[];
}
