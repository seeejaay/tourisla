// AddTouristSpot.tsx

"use client";

import { useState } from "react";
import { useTouristSpotManager } from "@/hooks/useTouristSpotManager";
import { touristSpotFields } from "@/app/static/tourist-spot/touristSpot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
export default function AddTouristSpot({
  onSuccess,
  onCancel,
}: {
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const initialForm = touristSpotFields.reduce((acc, field) => {
    if (field.name === "days_open") {
      acc[field.name] = [];
    } else {
      acc[field.name] = "";
    }
    return acc;
  }, {} as Record<string | number, string | number | string[]>);
  initialForm.image = "";
  initialForm.province = "CEBU";

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const { createTouristSpot } = useTouristSpotManager();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setImageFiles(files);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, multiple, options } = e.target as HTMLSelectElement;
    if (name === "days_open" && multiple) {
      const selected = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);
      setForm((prev) => ({ ...prev, [name]: selected }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "days_open" && Array.isArray(value)) {
          value.forEach((v) => formData.append("days_open[]", v));
        } else {
          formData.append(key, value as string);
        }
      });
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      await createTouristSpot(formData);
      if (onSuccess) onSuccess();
      setForm(initialForm);
      setImageFiles([]);
    } catch (err) {
      setError(
        "Failed to create Tourist Spot. Please try again. " +
          (err instanceof Error ? err.message : "")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-5xl  space-y-6 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {touristSpotFields
          .filter(
            (field) =>
              ![
                "description",
                "rules",
                "images",
                "opening_time",
                "closing_time",
              ].includes(field.name)
          )
          .map((field) => (
            <div className="space-y-1" key={field.name}>
              <Label
                htmlFor={field.name}
                className="text-sm font-medium text-gray-600"
              >
                {field.label}
              </Label>
              {field.name === "barangay" ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500
    ${
      form.municipality !== "BANTAYAN"
        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
        : "bg-white text-gray-900 border-gray-200"
    }`}
                  disabled={form.municipality !== "BANTAYAN"}
                >
                  <option value="">{field.placeholder}</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.name === "municipality" ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{field.placeholder}</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.name === "province" ? (
                <Input
                  id={field.name}
                  name={field.name}
                  value="CEBU"
                  readOnly
                  className="w-full text-sm bg-gray-100 text-gray-600"
                />
              ) : field.name === "days_open" ? (
                <div className="mb-4">
                  <Label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  ></Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    placeholder="e.g. Monday to Friday"
                    value={form[field.name]}
                    onChange={(e) => {
                      setForm((prev) => ({
                        ...prev,
                        [field.name]: e.target.value,
                      }));
                    }}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the days when this spot is open to visitors
                  </p>
                </div>
              ) : field.type === "select" ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{field.placeholder}</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  id={field.name}
                  type={field.type}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full text-sm"
                />
              )}
            </div>
          ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["opening_time", "closing_time"].map((fieldName) => {
          const field = touristSpotFields.find((f) => f.name === fieldName);
          return field ? (
            <div className="space-y-1" key={fieldName}>
              <Label className="text-sm font-medium text-gray-600">
                {field.label}
              </Label>
              <Input
                id={fieldName}
                type="time"
                name={fieldName}
                value={form[fieldName]}
                onChange={handleChange}
                className="w-full text-sm"
              />
            </div>
          ) : null;
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["description", "rules"].map((fieldName) => {
          const field = touristSpotFields.find((f) => f.name === fieldName);
          return field ? (
            <div className="space-y-1" key={fieldName}>
              <Label className="text-sm font-medium text-gray-600">
                {field.label}
              </Label>
              <Textarea
                id={fieldName}
                name={fieldName}
                value={form[fieldName]}
                onChange={handleChange}
                placeholder={field.placeholder}
                rows={4}
                className="w-full text-sm min-h-[100px]"
              />
            </div>
          ) : null;
        })}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-600">Images</Label>
        <Input
          id="images"
          type="file"
          name="images"
          accept="image/*"
          onChange={handleImageChange}
          className="text-sm"
          multiple
        />
      </div>

      {error && (
        <div className="px-3 py-2 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2 justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="text-sm"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={loading}
          className="text-sm bg-blue-600 hover:bg-blue-700"
        >
          {loading ? "Adding..." : "Add Tourist Spot"}
        </Button>
      </div>
    </form>
  );
}
