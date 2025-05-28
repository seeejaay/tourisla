export const hotlineFields = [
  {
    name: "municipality",
    label: "Municipality",
    type: "select",
    options: [
      { value: "SANTA_FE", label: "Santa Fe" },
      { value: "BANTAYAN", label: "Bantayan" },
      { value: "MADRIDEJOS", label: "Madridejos" },
    ],
  },
  {
    name: "type",
    label: "Hotline Type",
    type: "select",
    options: [
      { value: "MEDICAL", label: "Medical" },
      { value: "POLICE", label: "Police" },
      { value: "BFP", label: "BFP" },
      { value: "NDRRMO", label: "NDRRMO" },
      { value: "COAST_GUARD", label: "Coast Guard" },
    ],
  },
  {
    name: "contact_number",
    label: "Contact Number",
    type: "text",
    placeholder: "+63XXXXXXXXXX",
  },
  {
    name: "address",
    label: "Address",
    type: "text",
    placeholder: "Address (optional)",
  },
];
