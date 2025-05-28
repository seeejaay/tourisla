"use client";

import { useState } from "react";
import { useTouristSpotManager } from "@/hooks/useTouristSpotManager";
import { touristSpotFields } from "@/app/static/tourist-spot/touristSpot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AddTouristSpot({
  onSuccess,
  onCancel,
}: {
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  // Build initial form state from fields config
  const initialForm = touristSpotFields.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {} as Record<string, string>);
  initialForm.image = ""; // Ensure image field is included
  initialForm.province = "CEBU"; // Default province
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { createTouristSpot } = useTouristSpotManager();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (imageFile) {
        formData.append("images", imageFile);
      }

      const created = await createTouristSpot(formData);
      if (!created) {
        setError("Failed to create tourist spot.");
        return;
      }
      setForm(initialForm);
      setImageFile(null);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError("Failed to create tourist spot. " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-xl shadow-md w-full max-w-6xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {touristSpotFields.map((field) => (
          <div key={field.name} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>

            {field.name === "province" ? (
              <Input
                type="text"
                name="province"
                value="CEBU"
                readOnly
                className="bg-gray-100 cursor-not-allowed text-gray-500"
              />
            ) : field.type === "textarea" ? (
              <Textarea
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            ) : field.type === "select" ? (
              <select
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{field.placeholder}</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === "file" ? (
              <Input
                type="file"
                name={field.name}
                accept={field.accept}
                onChange={handleImageChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white file:mr-3 file:py-1 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            ) : (
              <Input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        ))}
      </div>

      {error && <div className="text-red-500 text-sm mt-4">{error}</div>}

      <div className="flex justify-end gap-3 pt-6">
        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
        >
          {loading ? "Adding..." : "Add Tourist Spot"}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border border-gray-300 text-gray-700 hover:bg-gray-100 py-2 px-6 rounded-lg"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
