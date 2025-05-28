import barangays from "@/app/static/barangay.json";

export const touristSpotFields = [
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
    name: "longitude", // Note: typo in your schema, should be "longitude"
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
    name: "opening_hours",
    label: "Opening Hours",
    type: "text",
    placeholder: "e.g., 8:00 AM",
  },
  {
    name: "closing_hours",
    label: "Closing Hours",
    type: "text",
    placeholder: "e.g., 5:00 PM",
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
    name: "image",
    label: "Image",
    type: "file",
    accept: "image/*",
  },
];
