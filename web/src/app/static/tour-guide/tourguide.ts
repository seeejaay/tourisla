export const tourGuideFields = [
  {
    name: "first_name",
    label: "First Name",
    type: "text",
    placeholder: "First Name",
    className: "uppercase",
  },
  {
    name: "last_name",
    label: "Last Name",
    type: "text",
    placeholder: "Last Name",
  },
  {
    name: "birth_date",
    label: "Birth Date",
    type: "date",
    placeholder: "Birth Date",
  },
  {
    name: "sex",
    label: "Sex",
    type: "select",
    placeholder: "Select Your Sex",
    options: [
      { value: "MALE", label: "MALE" },
      { value: "FEMALE", label: "FEMALE" },
    ],
  },
  {
    name: "mobile_number",
    label: "Mobile Number",
    type: "text",
    placeholder: "+639XXXXXXXXX",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Email",
  },
  {
    name: "profile_picture",
    label: "Profile Picture",
    type: "file",
    placeholder: "Profile Picture",
  },
  {
    name: "reason_for_applying",
    label: "Reason for Applying",
    type: "textarea",
    placeholder: "Reason for applying as a tour guide",
  },
];
