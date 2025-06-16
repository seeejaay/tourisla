export const tourOperatorFields = [
  {
    name: "operator_name",
    label: "Operator Name",
    type: "text",
    placeholder: "Operator Name",
  },
  {
    name: "representative_name",
    label: "Representative Name",
    type: "text",
    placeholder: "Representative Name",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Email",
  },
  {
    name: "mobile_number",
    label: "Mobile Number",
    type: "text",
    placeholder: "+639XXXXXXXXX",
  },
  {
    name: "office_address",
    label: "Office Address",
    type: "text",
    placeholder: "Office Address",
  },
];

export const tourOperatorDocuFields = [
  {
    name: "document_type",
    label: "Document Type",
    type: "select",
    placeholder: "Select Document Type",
    options: [
      { value: "LETTER_OF_INTENT", label: "Letter of Intent" },
      { value: "BUSINESS_PERMIT", label: "Business Permit" },
      { value: "DTI_OR_SEC", label: "DTI or SEC Registration" },
      { value: "BIR_CERTIFICATE", label: "BIR Certificate" },
      { value: "PROOF_OF_OFFICE", label: "Proof of Office" },
      { value: "OFFICE_PHOTOS", label: "Office Photos" },
      { value: "BRGY_CLEARANCE", label: "Barangay Clearance" },
      { value: "DOLE_REGISTRATION", label: "DOLE Registration" },
      { value: "EMPLOYEE_LIST", label: "Employee List" },
      { value: "MANAGER_RESUME_ID", label: "Manager Resume/ID" },
      {
        value: "MANAGER_PROOF_OF_EXPERIENCE",
        label: "Manager Proof of Experience",
      },
      { value: "TOUR_PACKAGES_LIST", label: "Tour Packages List" },
      { value: "PARTNER_ESTABLISHMENTS", label: "Partner Establishments" },
      { value: "VOUCHER_SAMPLE", label: "Voucher Sample" },
      { value: "CLIENT_FEEDBACK_FORM", label: "Client Feedback Form" },
      { value: "AFFIDAVIT_OF_UNDERTAKING", label: "Affidavit of Undertaking" },
      { value: "ECC_OR_CNC", label: "ECC or CNC" },
    ],
  },
  {
    name: "file_path",
    label: "File Upload",
    type: "file",
    placeholder: "Upload your document here",
  },
];
