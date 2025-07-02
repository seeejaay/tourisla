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
    <div className="w-full flex flex-col items-center justify-start">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl p-4 sm:p-6 space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="space-y-1 w-full" key={field.name}>
                <Label
                  htmlFor={field.name}
                  className="block text-sm font-semibold mb-1 text-[#1c5461]"
                >
                  {field.label}
                </Label>
                {field.name === "barangay" ? (
                  <select
                    id={field.name}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-[#3e979f] focus:border-[#3e979f] ${
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
                    className="w-full px-3 py-2 text-sm border border-[#e6f7fa] rounded-md focus:ring-1 focus:ring-[#3e979f] focus:border-[#3e979f]"
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
                    className="w-full text-sm"
                  />
                ) : field.type === "select" ? (
                  <select
                    id={field.name}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-[#e6f7fa] rounded-md focus:ring-1 focus:ring-[#3e979f] focus:border-[#3e979f]"
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
                <Label className="block text-sm font-semibold mb-1 text-[#1c5461]">
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
                <Label className="block text-sm font-semibold mb-1 text-[#1c5461]">
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

        <div>
          <Label className="block text-sm font-semibold mb-1 text-[#1c5461]">
            Images
          </Label>
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

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div className="flex gap-2 justify-end pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="bg-[#3e979f] hover:bg-[#1c5461] text-white font-semibold px-6 py-2 rounded-lg shadow"
          >
            {loading ? "Adding..." : "Add Tourist Spot"}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-[#e6f7fa] text-[#1c5461] font-semibold px-6 py-2 rounded-lg"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
