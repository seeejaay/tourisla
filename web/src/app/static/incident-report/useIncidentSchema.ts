import * as yup from "yup";

export interface IncidentReport {
  status: string;
  id: number;
  submitted_by?: number;
  submitted_by_name?: string;
  submitted_by_role?: string;
  role: string;
  incident_type: string;
  location: string;
  description: string;
  photo_url?: string;
  submitted_at?: string;
  incident_date: string;
  incident_time: string;
}

export const incidentSchema = yup.object().shape({
  incident_type: yup.string().required("Incident type is required"),
  location: yup.string().required("Location is required"),
  incident_date: yup.date().required("Incident date is required"),
  incident_time: yup
    .string()
    .matches(
      /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/,
      "Use format HH:MM or HH:MM:SS"
    )
    .required("Incident time is required"),
  description: yup.string().required("Description is required"),
  photo: yup.mixed().notRequired(),
});
