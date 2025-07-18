import countries from "@/app/static/countries.json";
export const visitorRegistrationFields = [
  {
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "Enter your name",
  },
  {
    name: "age",
    label: "Age",
    type: "number",
    placeholder: "Enter your age",
  },
  {
    name: "sex",
    label: "Sex",
    type: "select",
    options: [
      { value: "Male", label: "Male" },
      { value: "Female", label: "Female" },
      { value: "Other", label: "Other" },
    ],
  },
  {
    name: "is_foreign",
    label: "Are you a foreign visitor?",
    type: "checkbox",
  },
  {
    name: "municipality",
    label: "City / Municipality",
    type: "select", // changed to dropdown
    options: [], // will be filled dynamically in your form
    placeholder: "Select your city or municipality",
  },
  {
    name: "province",
    label: "Province",
    type: "select", // changed to dropdown
    options: [], // will be filled dynamically in your form
    placeholder: "Select your province",
  },
  {
    name: "country",
    label: "Country",
    type: "select",
    options: countries.map((country) => ({
      value: country.name,
      label: country.name,
    })),
  },
];
