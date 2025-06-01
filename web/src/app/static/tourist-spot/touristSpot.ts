import barangays from "@/app/static/barangay.json";
import type { TouristSpot } from "./useTouristSpotManagerSchema";

type TouristSpotField = {
  name: keyof TouristSpot;
  label: string;
  type: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  accept?: string;
};

export const touristSpotFields: TouristSpotField[] = [
  {
    name: "name",
    label: "Tourist Spot Name",
    type: "text",
    placeholder: "Obo-ob Mangrove Ecopark",
  },
  {
    name: "type",
    label: "Tourist Spot Type",
    type: "select",
    placeholder: "Select a type",
    options: [
      { value: "ADVENTURE", label: "Adventure" },
      { value: "BEACH", label: "Beach" },
      { value: "CAMPING", label: "Camping" },
      { value: "CULTURAL", label: "Cultural" },
      { value: "HISTORICAL", label: "Historical" },
      { value: "NATURAL", label: "Natural" },
      { value: "RECREATIONAL", label: "Recreational" },
      { value: "RELIGIOUS", label: "Religious" },
      { value: "OTHERS", label: "Others" },
    ],
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "A brief description of the tourist spot",
  },
  {
    name: "barangay",
    label: "Barangay",
    type: "select",
    placeholder: "Select a barangay",
    options: barangays.map((barangay) => ({
      value: barangay.name,
      label: barangay.name,
    })),
  },
  {
    name: "municipality",
    label: "Municipality",
    type: "select",
    placeholder: "Select a municipality",
    options: [
      { value: "SANTA_FE", label: "Santa Fe" },
      { value: "BANTAYAN", label: "Bantayan" },
      { value: "MADRIDEJOS", label: "Madridejos" },
    ],
  },
  {
    name: "province",
    label: "Province",
    type: "text",
    placeholder: "Cebu",
  },
  {
    name: "longitude",
    label: "Longitude",
    type: "text",
    placeholder: "123.456789",
  },
  {
    name: "latitude",
    label: "Latitude",
    type: "text",
    placeholder: "12.345678",
  },
  {
    name: "opening_time",
    label: "Opening Hours",
    type: "text",
    placeholder: "e.g., 8:00 AM",
  },
  {
    name: "closing_time",
    label: "Closing Hours",
    type: "text",
    placeholder: "e.g., 5:00 PM",
  },
  {
    name: "days_open",
    label: "Days Open",
    type: "select",
    placeholder: "Select days open",
    options: [
      { value: "MONDAY", label: "M" },
      { value: "TUESDAY", label: "T" },
      { value: "WEDNESDAY", label: "W" },
      { value: "THURSDAY", label: "Th" },
      { value: "FRIDAY", label: "F" },
      { value: "SATURDAY", label: "S" },
      { value: "SUNDAY", label: "S" },
    ],
  },
  {
    name: "entrance_fee",
    label: "Entrance Fee (N/A if none)",
    type: "text",
    placeholder: "e.g., 50.00",
  },
  {
    name: "other_fees",
    label: "Other Fees (N/A if none)",
    type: "text",
    placeholder: "e.g., Parking fee, Guide fee",
  },
  {
    name: "contact_number",
    label: "Contact Number",
    type: "text",
    placeholder: "+63XXXXXXXXXX",
  },
  {
    name: "facebook_page",
    label: "Facebook Page",
    type: "text",
    placeholder: "https://www.facebook.com/your-tourist-spot",
  },
  {
    name: "rules",
    label: "Rules",
    type: "textarea",
    placeholder: "List of rules or guidelines for visitors",
  },
  {
    name: "images",
    label: "Image",
    type: "file",
    accept: "image/*",
  },
];
