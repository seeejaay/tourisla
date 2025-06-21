// EditTouristSpot.tsx

"use client";

import { useState, useEffect } from "react";
import { useTouristSpotManager } from "@/hooks/useTouristSpotManager";
import { touristSpotFields } from "@/app/static/tourist-spot/touristSpot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TouristSpot } from "@/app/static/tourist-spot/useTouristSpotManagerSchema";

export default function EditTouristSpot({
  touristSpot,
  onSuccess,
  onCancel,
}: {
  touristSpot: TouristSpot;
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  // Initialize form with the touristSpot prop
  const [form, setForm] = useState<Record<string, any>>({ ...touristSpot });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const { updateTouristSpot } = useTouristSpotManager();

  // Reset barangay if municipality changes
  useEffect(() => {
    if (form.municipality !== "BANTAYAN") {
      setForm((prev) => ({ ...prev, barangay: "" }));
    }
  }, [form.municipality]);

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
        } else if (key === "images") {
          // skip existing images array
        } else {
          formData.append(key, value as string);
        }
      });
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      await updateTouristSpot(touristSpot.id!, formData);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(
        "Failed to update Tourist Spot. Please try again. " +
          (err instanceof Error ? err.message : "")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-5xl space-y-6 p-4">
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
              {field.name === "barangay" &&
                form.municipality !== "BANTAYAN" && (
                  <p className="text-xs text-amber-600">
                    Barangay selection is only available for Bantayan
                    municipality.
                  </p>
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
        {/* Show existing images */}
        {form.images &&
          Array.isArray(form.images) &&
          form.images.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-xs text-gray-500">Current Images</p>
              <div className="flex flex-wrap gap-2">
                {form.images.map((image, idx: number) => (
                  <div
                    key={idx}
                    className="relative aspect-square w-44 h-24 rounded-md overflow-hidden border border-gray-200"
                  >
                    <img
                      src={image.image_url.replace(/\s/g, "")}
                      alt={`Tourist Spot Image ${idx + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
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
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
