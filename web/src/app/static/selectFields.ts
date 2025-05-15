import countries from "@/app/static/countries.json";

const selectFields = () => {
  return [
    {
      name: "nationality",
      label: "Nationality",
      options: countries.map((country) => ({
        value: country.name,
        label: country.name,
      })),
    },
    {
      name: "role",
      label: "Role",
      type: "select",
      placeholder: "Select Role",
      options: [
        { value: "Tourist", label: "Tourist" },
        { value: "Tour Guide", label: " Tour Guide" },
        { value: "Admin", label: "Admin" },
        { value: "Tour Operator", label: "Tour Operator" },
        { value: "Tourism Staff", label: "Tourism Staff" },
        { value: "Tourism Officer", label: "Tourism Officer" },
        { value: "Cultural Director", label: "Cultural Director" },
      ],
    },
  ];
};
export default selectFields;
