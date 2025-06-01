"use client";
import { useState } from "react";
import { TouristSpot } from "@/app/static/tourist-spot/useTouristSpotManagerSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { touristSpotSchema } from "@/app/static/tourist-spot/useTouristSpotManagerSchema";
import { touristSpotFields } from "@/app/static/tourist-spot/touristSpot";

export default function EditTouristSpot({
  touristSpot,
  onSave,
  onCancel,
}: {
  touristSpot: TouristSpot;
  onSave: (updatedTouristSpot: TouristSpot | FormData) => void | Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<TouristSpot>({ ...touristSpot });
  const [error, setError] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageFiles(e.target.files);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate with Zod schema
    const result = touristSpotSchema.safeParse(form);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    // If images are changed, use FormData
    if (imageFiles && imageFiles.length > 0) {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key !== "images") {
          formData.append(key, value as string);
        }
      });
      Array.from(imageFiles).forEach((file) => {
        formData.append("images", file);
      });
      onSave(formData);
    } else {
      onSave(form);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Layer 1: Basic Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
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
          .map((field: (typeof touristSpotFields)[number]) => (
            <div className="space-y-1" key={field.name}>
              <Label
                htmlFor={field.name}
                className="text-sm font-medium text-gray-600"
              >
                {field.label}
              </Label>
              {field.name === "province" ? (
                <Input
                  id={field.name}
                  name={field.name}
                  value={form[field.name as keyof TouristSpot] as string}
                  readOnly
                  className="w-full text-sm bg-gray-100"
                />
              ) : field.name === "days_open" ? (
                <fieldset className="w-full">
                  <legend className="sr-only">{field.label}</legend>
                  <div className="flex flex-row justify-center gap-1">
                    {field.options?.map((option) => {
                      const checked =
                        Array.isArray(form.days_open) &&
                        form.days_open.includes(
                          option.value as TouristSpot["days_open"][number]
                        );
                      return (
                        <label
                          key={option.value}
                          className={`flex items-center justify-center w-8 h-8 rounded-md border text-base font-medium cursor-pointer transition-colors
            ${
              checked
                ? "bg-blue-600 text-white border-blue-600 shadow"
                : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
            }`}
                          htmlFor={`days_open_${option.value}`}
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(checked) => {
                              setForm((prev) => {
                                const days = Array.isArray(prev.days_open)
                                  ? prev.days_open
                                  : [];
                                return {
                                  ...prev,
                                  days_open: checked
                                    ? [
                                        ...days,
                                        option.value as TouristSpot["days_open"][number],
                                      ]
                                    : days.filter(
                                        (v) =>
                                          v !==
                                          (option.value as TouristSpot["days_open"][number])
                                      ),
                                };
                              });
                            }}
                            id={`days_open_${option.value}`}
                            className="sr-only"
                          />
                          {option.label}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              ) : field.type === "select" ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={form[field.name as keyof TouristSpot] as string}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{field.placeholder}</option>
                  {field.options?.map(
                    (option: { value: string; label: string }) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    )
                  )}
                </select>
              ) : (
                <Input
                  id={field.name}
                  type={field.type}
                  name={field.name}
                  value={form[field.name as keyof TouristSpot] as string}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full text-sm"
                />
              )}
            </div>
          ))}
      </div>

      {/* Layer 2: Time Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                value={form[fieldName as keyof TouristSpot] as string}
                onChange={handleChange}
                className="w-full text-sm"
              />
            </div>
          ) : null;
        })}
      </div>

      {/* Layer 3: Long Text Fields */}
      <div className="flex flex-row gap-4 w-full ">
        {["description", "rules"].map((fieldName) => (
          <div className="space-y-1 w-full " key={fieldName}>
            <Label className="text-sm font-medium text-gray-600">
              {touristSpotFields.find((f) => f.name === fieldName)?.label}
            </Label>
            <Textarea
              id={fieldName}
              name={fieldName}
              value={form[fieldName as keyof TouristSpot] as string}
              onChange={handleChange}
              placeholder={
                touristSpotFields.find((f) => f.name === fieldName)?.placeholder
              }
              rows={4}
              className="w-full text-sm min-h-[100px]"
            />
          </div>
        ))}
      </div>

      {/* Images Section */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-600 ">Images</Label>
        <div className="flex items-center gap-2">
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

        {form.images && form.images.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-xs text-gray-500">Current Images</p>
            <div className="flex flex-wrap gap-2">
              {form.images.map((image, idx) => (
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

      <div className="flex flex-col-reverse sm:flex-row gap-3  justify-end">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="text-sm"
        >
          Cancel
        </Button>
        <Button type="submit" className="text-sm bg-blue-600 hover:bg-blue-700">
          Save Changes
        </Button>
      </div>
    </form>
  );
}
