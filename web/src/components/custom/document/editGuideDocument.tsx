"use client";
import React, { useState, useEffect } from "react";
import { useDocumentManager } from "@/hooks/useDocumentManager";
import { tourGuideDocuFields } from "@/app/static/tour-guide/tourguide";

type EditGuideDocumentProps = {
  guideId: string;
  docuId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

const EditGuideDocument: React.FC<EditGuideDocumentProps> = ({
  docuId,
  onSuccess,
  onCancel,
}) => {
  const { editGuideDocument, fetchGuideDocument, loading, error } =
    useDocumentManager();

  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    document_type: "",
    requirements: [] as string[],
    file_path: "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch existing document data
  useEffect(() => {
    const fetchData = async () => {
      const doc = await fetchGuideDocument(docuId);
      if (doc) {
        setForm({
          document_type: doc.document_type || "",
          requirements: doc.requirements || [],
          file_path: doc.file_path || "",
        });
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docuId]);

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

    // Build document data
    const documentData: any = {
      document_type: form.document_type,
      requirements: form.requirements,
    };

    // If a new file is selected, you may need to handle file upload separately in your API
    if (file) {
      documentData.file = file;
    }

    try {
      const result = await editGuideDocument(docuId, documentData);
      if (result && onSuccess) onSuccess();
    } catch (error) {
      setFormError(error + "Failed to update document.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      {tourGuideDocuFields.map((field) => {
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
              {file ? (
                <div className="text-xs text-gray-500 mt-1">
                  Selected: {file.name}
                </div>
              ) : form.file_path ? (
                <div className="text-xs text-gray-500 mt-1">
                  Current: {form.file_path.split("/").pop()}
                </div>
              ) : null}
            </div>
          );
        }
        if (field.type === "checkbox") {
          return (
            <div key={field.name}>
              <label className="block mb-1 font-medium">{field.label}</label>
              <div className="flex flex-wrap gap-2">
                {field.options?.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-1">
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
          {loading ? "Saving..." : "Update Document"}
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

export default EditGuideDocument;
