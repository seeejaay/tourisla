const tourPackageFields = [
  {
    name: "package_name",
    label: "Package Name",
    type: "text",
    placeholder: "Package Name",
  },
  {
    name: "location",
    label: "Location",
    type: "text",
    placeholder: "Location",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Description of the tour package",
  },
  {
    name: "price",
    label: "Price",
    type: "number",
    placeholder: "Price in PHP",
  },
  {
    name: "duration_days",
    label: "Duration",
    type: "number",
    placeholder: "Duration in days",
  },
  {
    name: "inclusions",
    label: "inclusions",
    type: "text",
    placeholder: "Inclusions (e.g., meals, transportation)",
  },
  {
    name: "exclusions",
    label: "Exclusions",
    type: "text",
    placeholder: "Exclusions (e.g., personal expenses)",
  },
  {
    name: "available_slots",
    label: "Slots Available",
    type: "number",
    placeholder: "Detailed itinerary of the tour package",
  },
  {
    name: "is_active",
    label: "Status",
    type: "select",
    options: [
      { value: "true", label: "Active" },
      { value: "false", label: "Inactive" },
    ],
  },
  {
    name: "date_start",
    label: "Start Date",
    type: "date",
    placeholder: "Start Date of the tour package",
  },
  {
    name: "date_end",
    label: "End Date",
    type: "date",
    placeholder: "End Date of the tour package",
  },
  {
    name: "start_time",
    label: "Start Time",
    type: "time",
    placeholder: "Start Time of the tour package",
  },
  {
    name: "end_time",
    label: "End Time",
    type: "time",
    placeholder: "End Time of the tour package",
  },
  {
    name: "cancellation_days",
    label: "Cancellation Days",
    type: "number",
    placeholder: "Number of days before the tour starts for cancellation",
  },
  {
    name: "cancellation_note",
    label: "Cancellation Note",
    type: "textarea",
    placeholder: "Cancellation policy note",
  },
];
export default tourPackageFields;
