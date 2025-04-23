import countries from "@/static/countries.json";
const formFields = [
  {
    name: "first_name",
    label: "First Name",
    type: "text",
    placeholder: "First Name",
  },
  {
    name: "last_name",
    label: "Last Name",
    type: "text",
    placeholder: "Last Name",
  },
  { name: "email", label: "Email", type: "text", placeholder: "Email" },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Password",
  },
  {
    name: "confirm_password",
    label: "Confirm Password",
    type: "password",
    placeholder: "Confirm Password",
  },
  {
    name: "phone_number",
    label: "Phone Number",
    type: "text",
    placeholder: "Phone Number",
  },
  {
    name: "role",
    label: "Role",
    type: "text",
    placeholder: "tourist",
    disabled: true,
  },
];
const selectFields = [
  {
    name: "traveller_type",
    label: "Traveller Type",
    options: [
      { value: "Solo", label: "Solo" },
      { value: "Couple", label: "Couple" },
      { value: "Family", label: "Family" },
      { value: "Group", label: "Group" },
    ],
  },
  {
    name: "nationality",
    label: "Nationality",
    options: countries.map((country) => ({
      value: country.name,
      label: country.name,
    })),
  },
];
export { formFields, selectFields };
