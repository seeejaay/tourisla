import * as yup from "yup";

export interface Price {
  id: number;
  amount: number;
  is_enabled: boolean;
  type?: string;
  created_at?: string;
  updated_at?: string;
}

export const priceSchema = yup.object().shape({
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .required("Amount is required")
    .min(0, "Amount must be greater than or equal to 0"),
  is_enabled: yup.boolean().required("Enabled status is required"),
});
