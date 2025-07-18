import barangays from "@/app/static/barangay.json";

export const incidentFields = [
  {
    name: "incident_type",
    label: "Incident Type",
    type: "select",
    options: [
      { value: "injury", label: "Injury" },
      { value: "theft", label: "Theft" },
      { value: "lost_item", label: "Lost Item" },
      { value: "vandalism", label: "Vandalism" },
      { value: "accident", label: "Accident" },
      { value: "harassment", label: "Harassment" },
      { value: "other", label: "Other" },
    ],
    placeholder: "e.g., Injury, Theft, Lost Item",
    required: true,
  },
  {
    name: "location",
    label: "Location",
    type: "select",
    options: [
      ...barangays.map((barangay) => ({
        value: barangay.code,
        label: barangay.name,
      })),
      { value: "madridejos", label: "MADRIDEJOS" },
      { value: "santa_fe", label: "SANTA FE" },
    ],
    placeholder: "Where did it happen?",
    required: true,
  },
  {
    name: "incident_date",
    label: "Incident Date",
    type: "date",
    required: true,
    placeholder: "Select date",
  },
  {
    name: "incident_time",
    label: "Incident Time",
    type: "time",
    required: true,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Provide a detailed description...",
    required: true,
  },
  {
    name: "photo",
    label: "Attach Photo (optional)",
    type: "file",
    accept: "image/*",
    required: false,
  },
];
