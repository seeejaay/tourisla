import countries from "@/app/static/countries.json";

const countrySelectField = () => {
  return [
    {
      name: "nationality",
      label: "Nationality",
      options: countries.map((country) => ({
        value: country.name,
        label: country.name,
      })),
    },
  ];
};
export default countrySelectField;
