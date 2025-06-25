import * as yup from "yup";

export const islandEntrySchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  sex: yup.string().required("Sex is required"),
  age: yup.number().required("Age is required").min(0),
  is_foreign: yup.boolean(),
  municipality: yup.string().when("is_foreign", {
    is: false,
    then: (schema) => schema.required("Municipality is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  province: yup.string().when("is_foreign", {
    is: false,
    then: (schema) => schema.required("Province is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  country: yup.string().when("is_foreign", {
    is: true,
    then: (schema) => schema.required("Country is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});