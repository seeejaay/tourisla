"use client";
import React, { useState } from "react";
import { useDocumentManager } from "@/hooks/useDocumentManager";
import { tourOperatorDocuFields } from "@/app/static/tour-operator/tour-operator"; // You should define this similar to tourGuideDocuFields

type AddOperatorDocumentProps = {
  operatorId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

const AddOperatorDocument: React.FC<AddOperatorDocumentProps> = ({
  operatorId,
  onSuccess,
  onCancel,
}) => {
  const { createOperatorDocument, loading, error } = useDocumentManager();

  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    document_type: "",
    // Add more fields if your operator document requires them
  });
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, files } = e.target as HTMLInputElement;

    if (type === "file") {
      setFile(files && files[0] ? files[0] : null);
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

    try {
      const result = await createOperatorDocument(operatorId, formData);
      if (result && onSuccess) onSuccess();
    } catch (error) {
      setFormError(error + " Failed to upload document.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      {tourOperatorDocuFields.map((field) => {
        if (field.type === "select") {
          return (
            <div key={field.name}>
              <label className="block mb-1 font-medium">{field.label}</label>
              <select
                name={field.name}
                value={form[field.name as keyof typeof form]}
                onChange={handleChange}
                required
                className="w-full border px-2 py-1 rounded"
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
              <label className="block mb-1 font-medium">{field.label}</label>
              <input
                type="file"
                name={field.name}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded"
              />
              {file && (
                <div className="text-xs text-gray-500 mt-1">
                  Selected: {file.name}
                </div>
              )}
            </div>
          );
        }
        // Default: text/email/textarea
        return (
          <div key={field.name}>
            <label className="block mb-1 font-medium">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={form[field.name as keyof typeof form] as string}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
        );
      })}
      {(formError || error) && (
        <div className="text-red-600">{formError || error}</div>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Saving..." : "Add Document"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default AddOperatorDocument;
