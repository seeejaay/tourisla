"use client";
import { useIncidentManager } from "@/hooks/useIncidentManager";
import { useFormik } from "formik";
import { incidentFields } from "@/app/static/incident-report/incidentFields";
import { incidentSchema } from "@/app/static/incident-report/useIncidentSchema";
import { useState } from "react";

interface IncidentFormValues {
  incident_type: string;
  location: string;
  incident_date: string;
  incident_time: string;
  description: string;
  photo: File | null;
}

export default function AddIncident() {
  const { loading, submitReport } = useIncidentManager();
  const [successMsg, setSuccessMsg] = useState("");

  const formik = useFormik<IncidentFormValues>({
    initialValues: {
      incident_type: "",
      location: "",
      incident_date: "",
      incident_time: "",
      description: "",
      photo: null,
    },
    validationSchema: incidentSchema,
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value) {
          formData.append(key, value);
        }
      });

      try {
        await submitReport(formData);
        setSuccessMsg("Incident report submitted successfully.");
        resetForm();
      } catch (err) {
        alert("Failed to submit incident report.");
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="bg-white shadow-md rounded p-6 space-y-4"
    >
      <h2 className="text-xl font-bold">Report an Incident</h2>
      {incidentFields.map((field) => (
        <div key={field.name}>
          <label className="block font-medium mb-1">{field.label}</label>

          {field.type === "textarea" ? (
            <textarea
              name={field.name}
              value={formik.values[field.name as keyof IncidentFormValues] as string}
              onChange={formik.handleChange}
              className="w-full border px-3 py-2 rounded"
              placeholder={field.placeholder}
            />
          ) : field.type === "file" ? (
            <input
              type="file"
              name={field.name}
              accept={field.accept}
              onChange={(e) => {
                const file = e.currentTarget.files?.[0] || null;
                formik.setFieldValue(field.name, file);
              }}
              className="w-full"
            />
          ) : (
            <input
              type={field.type}
              name={field.name}
              value={formik.values[field.name as keyof IncidentFormValues] as string}
              onChange={formik.handleChange}
              placeholder={field.placeholder}
              className="w-full border px-3 py-2 rounded"
            />
          )}

          {formik.touched[field.name as keyof IncidentFormValues] &&
            formik.errors[field.name as keyof IncidentFormValues] && (
              <p className="text-sm text-red-600 mt-1">
                {formik.errors[field.name as keyof IncidentFormValues]}
              </p>
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
      >
        {loading ? "Submitting..." : "Submit Report"}
      </button>

      {successMsg && <p className="text-green-600 mt-2">{successMsg}</p>}
    </form>
  );
}
