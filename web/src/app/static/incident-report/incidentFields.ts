export const incidentFields = [
  {
    name: "incident_type",
    label: "Incident Type",
    type: "text",
    placeholder: "e.g., Injury, Theft, Lost Item",
    required: true,
  },
  {
    name: "location",
    label: "Location",
    type: "text",
    placeholder: "Where did it happen?",
    required: true,
  },
  {
    name: "incident_date",
    label: "Incident Date",
    type: "date",
    required: true,
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
