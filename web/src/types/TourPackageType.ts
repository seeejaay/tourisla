import type { TourGuide } from "./TourGuideType";

export type TourPackage = {
  id?: number;
  package_name: string;
  location: string;
  price: number;
  description: string;
  inclusions: string;
  exclusions: string;
  available_slots: number;
  date_start: string;
  date_end: string;
  start_time?: string;
  end_time?: string;
  guide_name?: string;
  image_url?: string;
  assigned_guides?: TourGuide[];
  operator_name?: string;
  is_active?: boolean;
  operator_email?: string;
};

export type RawTourGuide = string | TourGuide;

export type RawTourPackage = Omit<TourPackage, "assigned_guides"> & {
  assigned_guides?: RawTourGuide[];
};
