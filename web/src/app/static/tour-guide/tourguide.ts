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

export const tourGuideDocuFields = [
  {
    name: "document_type",
    label: "Document Type",
    type: "select",
    options: [
      { value: "GOV_ID", label: "Government ID" },
      { value: "BIRTH_CERT", label: "Birth Certificate" },
      { value: "NBI_CLEARANCE", label: "NBI Clearance" },
      { value: "BRGY_CLEARANCE", label: "Barangay Clearance" },
      { value: "MED_CERT", label: "Medical Certificate" },
      { value: "PASSPORT_PHOTO", label: "Passport" },
      { value: "RESUME", label: "Resume" },
    ],
  },
  {
    name: "file_path",
    label: "File Upload",
    type: "file",
    placeholder: "Upload your document here",
  },
  {
    name: "requirements",
    label: "Requirements",
    type: "checkbox",
    placeholder: "Select all that apply",
    options: [
      { value: "FILIPINO_CITIZEN", label: "Filipino Citizen" },
      { value: "FIT", label: "Fit to Work" },
      { value: "FLUENT", label: "Fluent" },
      { value: "TRAINING_CERTIFIED", label: "Training Certified" },
      { value: "NO_CRIMINAL_RECORD", label: "No Criminal Record" },
    ],
  },
];
