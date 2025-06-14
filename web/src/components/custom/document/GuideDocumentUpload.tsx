"use client";
import React, { useState, useRef } from "react";
import { useDocumentManager } from "@/hooks/useDocumentManager";
import { tourGuideDocuFields } from "@/app/static/tour-guide/tourguide";

type GuideDocumentForm = {
  document_type: string;
  requirements: string[];
  file_path: File | null;
};

export default function GuideDocumentUpload({
  tourguide_id,
}: {
  tourguide_id: string;
}) {
  const { createGuideDocument, loading, error } = useDocumentManager();
  const [form, setForm] = useState<GuideDocumentForm>({
    document_type: "",
    requirements: [],
    file_path: null,
  });
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, files, checked } = e.target as HTMLInputElement;
    if (type === "file" && files && files[0]) {
      setForm((prev) => ({ ...prev, file_path: files[0] }));
    } else if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        requirements: checked
          ? [...prev.requirements, value]
          : prev.requirements.filter((req) => req !== value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);

    if (!form.document_type || !form.file_path) {
      return;
    }

    // Prepare data for API (excluding file)
    const documentData = {
      document_type: form.document_type,
      requirements: form.requirements, // ✅ keep as array!
    };

    const result = await createGuideDocument(
      tourguide_id,
      documentData,
      form.file_path
    );
    if (result) {
      setSuccess("Document uploaded successfully!");
      setForm({ document_type: "", requirements: [], file_path: null });
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Upload Document</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {tourGuideDocuFields.map((field) => {
          if (field.type === "select") {
            return (
              <div key={field.name}>
                <label className="block mb-1 font-medium">{field.label}</label>
                <select
                  name={field.name}
                  value={form[field.name as keyof GuideDocumentForm] as string}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 w-full"
                  required
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          }
          if (field.type === "file") {
            return (
              <div key={field.name}>
                <label className="block mb-1 font-medium">{field.label}</label>
                <input
                  type="file"
                  name={field.name}
                  accept="application/pdf,image/*"
                  onChange={handleChange}
                  ref={fileInputRef}
                  required
                />
              </div>
            );
          }
          if (field.type === "checkbox") {
            return (
              <div key={field.name}>
                <label className="block mb-1 font-medium">{field.label}</label>
                <div className="flex flex-wrap gap-4">
                  {field.options?.map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name={field.name}
                        value={opt.value}
                        checked={form.requirements.includes(opt.value)}
                        onChange={handleChange}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            );
          }
          return null;
        })}
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}
