import countries from "@/app/static/countries.json";
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
      { value: "solo_traveller", label: "Solo Traveller" },
      { value: "family_traveller", label: "Family Traveller" },
      { value: "group_traveller", label: "Group Traveller" },
      { value: "business_traveller", label: "Business Traveller" },
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
