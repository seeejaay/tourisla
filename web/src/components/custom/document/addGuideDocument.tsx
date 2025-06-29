"use client";
import React, { useState } from "react";
import { useDocumentManager } from "@/hooks/useDocumentManager";
import { tourGuideDocuFields } from "@/app/static/tour-guide/tourguide";

type AddGuideDocumentProps = {
  guideId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

const AddGuideDocument: React.FC<AddGuideDocumentProps> = ({
  guideId,
  onSuccess,
  onCancel,
}) => {
  const { createGuideDocument, loading, error } = useDocumentManager();

  // Store the actual File object, not just the name
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    document_type: "",
    requirements: [] as string[],
  });
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked, files } = e.target as HTMLInputElement;

    if (type === "file") {
      setFile(files && files[0] ? files[0] : null);
    } else if (type === "checkbox") {
      setForm((prev) => {
        const reqs = new Set(prev.requirements);
        if (checked) {
          reqs.add(value);
        } else {
          reqs.delete(value);
        }
        return { ...prev, requirements: Array.from(reqs) };
      });
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!form.document_type) {
      setFormError("Document type is required.");
      return;
    }
    if (!file) {
      setFormError("File is required.");
      return;
    }

    // Build FormData
    const formData = new FormData();
    formData.append("document", file);
    formData.append("document_type", form.document_type);
    form.requirements.forEach((req) => formData.append("requirements", req));

    try {
      const result = await createGuideDocument(guideId, formData);
      if (result && onSuccess) onSuccess();
    } catch (error) {
      setFormError(error + " Failed to upload document.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto p-6">
      {tourGuideDocuFields.map((field) => {
        if (field.type === "select") {
          return (
            <div key={field.name}>
              <label className="block mb-1 font-semibold text-[#3e979f]">
                {field.label}
              </label>
              <select
                name={field.name}
                value={form[field.name as keyof typeof form]}
                onChange={handleChange}
                required
                className="w-full border border-[#b6e0e4] px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#3e979f] bg-[#f8fcfd] transition"
              >
                <option value="">Select...</option>
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
              <label className="block mb-1 font-semibold text-[#3e979f]">
                {field.label}
              </label>
              <input
                type="file"
                name={field.name}
                onChange={handleChange}
                className="w-full border border-[#b6e0e4] px-3 py-2 rounded-lg bg-[#f8fcfd]"
              />
              {file && (
                <div className="text-xs text-gray-500 mt-1">
                  Selected: {file.name}
                </div>
              )}
            </div>
          );
        }
        if (field.type === "checkbox") {
          return (
            <div key={field.name}>
              <label className="block mb-1 font-semibold text-[#3e979f]">
                {field.label}
              </label>
              <div className="flex flex-wrap gap-3">
                {field.options?.map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-2 text-[#17414a] bg-[#f8fcfd] px-2 py-1 rounded"
                  >
                    <input
                      type="checkbox"
                      name={field.name}
                      value={opt.value}
                      checked={form.requirements.includes(opt.value)}
                      onChange={handleChange}
                      className="accent-[#3e979f]"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
          );
        }
        // Default: text/email/textarea
        return (
          <div key={field.name}>
            <label className="block mb-1 font-semibold text-[#3e979f]">
              {field.label}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={form[field.name as keyof typeof form] as string}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="w-full border border-[#b6e0e4] px-3 py-2 rounded-lg bg-[#f8fcfd] transition"
            />
          </div>
        );
      })}
      {(formError || error) && (
        <div className="text-red-600 font-medium">{formError || error}</div>
      )}
      <div className="flex gap-3 justify-end pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#3e979f] hover:bg-[#1c5461] text-white px-6 py-2 rounded-lg font-semibold shadow transition"
        >
          {loading ? "Saving..." : "Add Document"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold shadow transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default AddGuideDocument;
