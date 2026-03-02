import countries from "@/static/countries.json";

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
    label: "Municipality/City",
    type: "select",
    options: [],
  },
  {
    name: "province",
    label: "Region",
    type: "select",
    options: [],
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
