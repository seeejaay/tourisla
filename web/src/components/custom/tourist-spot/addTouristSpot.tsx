"use client";

import { useState } from "react";
import { useTouristSpotManager } from "@/hooks/useTouristSpotManager";
import { touristSpotFields } from "@/app/static/tourist-spot/touristSpot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { touristSpotSchema } from "@/app/static/tourist-spot/useTouristSpotManagerSchema";
import { ZodError } from "zod";
import Image from "next/image";
const BANTAYAN_POLYGON: [number, number][] = [
  [11.3040035, 123.7223524],
  [11.2144373, 123.6749739],
  [11.1720015, 123.6296553],
  [11.095871, 123.6015028],
  [11.0230905, 123.5891432],
  [11.0338739, 123.6317152],
  [11.088459, 123.7498182],
  [11.1396653, 123.8150495],
  [11.167286, 123.8226026],
  [11.1928834, 123.7917036],
  [11.2144373, 123.7786573],
  [11.2474386, 123.767671],
  [11.2838031, 123.7621778],
  [11.3087168, 123.7360853],
  [11.3040035, 123.7223524],
];

const HILANTAGAAN_POLYGON: [number, number][] = [
  [11.2203793, 123.8200285],
  [11.2238311, 123.7897303],
  [11.2223998, 123.7818338],
  [11.2149069, 123.7821772],
  [11.2024462, 123.7882711],
  [11.1897325, 123.8069822],
  [11.1862803, 123.8247492],
  [11.1907428, 123.8384821],
  [11.2021936, 123.840542],
  [11.2116234, 123.8337614],
  [11.2203793, 123.8200285],
];

const KINATARKAN_POLYGON: [number, number][] = [
  [11.3593833, 123.892575],
  [11.3425529, 123.8783271],
  [11.3282463, 123.8714607],
  [11.3102358, 123.8680275],
  [11.2942443, 123.8680275],
  [11.2858273, 123.882962],
  [11.2942443, 123.9080246],
  [11.3169689, 123.9241607],
  [11.3327908, 123.9222724],
  [11.3578686, 123.9155777],
  [11.3458186, 124.1160323],
  [11.3593833, 123.892575],
];

const POLYGONS: [number, number][][] = [
  BANTAYAN_POLYGON,
  HILANTAGAAN_POLYGON,
  KINATARKAN_POLYGON,
];

function isPointInAnyPolygon(
  lat: number,
  lng: number,
  polygons: [number, number][][]
) {
  return polygons.some((polygon) => isPointInPolygon(lat, lng, polygon));
}

function isPointInPolygon(
  lat: number,
  lng: number,
  polygon: [number, number][]
) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0],
      yi = polygon[i][1];
    const xj = polygon[j][0],
      yj = polygon[j][1];
    const intersect =
      yi > lng !== yj > lng && lat < ((xj - xi) * (lng - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

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

  const handleChange = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, multiple, options, type, files } =
      e.target as HTMLInputElement & HTMLSelectElement;
    let updatedForm = { ...form };

    if (name === "days_open" && multiple) {
      const selected = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);
      updatedForm = { ...form, [name]: selected };
      setForm(updatedForm);
    } else if (name === "images" && type === "file" && files) {
      const fileArray = Array.from(files);
      for (const file of fileArray) {
        if (!file.type.startsWith("image/")) {
          setError("Only image files are allowed.");
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          setError("Each image must be less than 5MB.");
          return;
        }
      }
      setImageFiles(fileArray);
      setError(null);
      return;
    } else {
      updatedForm = { ...form, [name]: value };
      setForm(updatedForm);
    }

    const fieldSchema =
      touristSpotSchema.shape[name as keyof typeof touristSpotSchema.shape];
    if (fieldSchema) {
      try {
        fieldSchema.parse(value);
        setError(null);
      } catch (err) {
        if (err instanceof ZodError) {
          setError(err.errors[0]?.message || "Invalid input for " + name);
        } else {
          setError("Invalid input for " + name);
        }
        return;
      }
    }

    if (name === "location" && value.trim() !== "") {
      const coords = await getLatLngFromInput(value);
      if (!coords || !isPointInAnyPolygon(coords.lat, coords.lng, POLYGONS)) {
        setError(
          "Location must be within Bantayan Island or its islets. Please enter a valid address or Google Maps link."
        );
      }
    }
  };

  async function getLatLngFromInput(
    input: string
  ): Promise<{ lat: number; lng: number } | null> {
    const latLngMatch = input
      .trim()
      .match(/^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/);
    if (latLngMatch) {
      const lat = parseFloat(latLngMatch[1]);
      const lng = parseFloat(latLngMatch[3]);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      input
    )}&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.status === "OK" && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      return { lat, lng };
    }
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = touristSpotSchema.safeParse(form);
    if (!result.success) {
      setLoading(false);
      setError(result.error.errors[0]?.message || "Invalid input.");
      return;
    }

    const loc = form.location as string;
    const coords = await getLatLngFromInput(loc);

    if (!coords || !isPointInAnyPolygon(coords.lat, coords.lng, POLYGONS)) {
      setLoading(false);
      setError(
        "Location must be within Bantayan Island or its islets. Please enter a valid address or Google Maps link."
      );
      return;
    }
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
        className="w-full   p-4 sm:p-8 md:p-10   space-y-6"
      >
        <h2 className="text-2xl font-bold text-[#1c5461] mb-2 text-center">
          Add Tourist Spot
        </h2>
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded mb-2 text-center text-sm">
            {error}
          </div>
        )}

        {/* Responsive grid for fields */}
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
              <div className="flex flex-col gap-1" key={field.name}>
                <Label
                  htmlFor={field.name}
                  className="text-sm font-semibold text-[#1c5461]"
                >
                  {field.label}
                </Label>
                {field.name === "barangay" ? (
                  <select
                    id={field.name}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-[#3e979f] focus:border-[#3e979f] transition ${
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
                    className="w-full px-3 py-2 text-sm border border-[#e6f7fa] rounded-md focus:ring-2 focus:ring-[#3e979f] focus:border-[#3e979f] transition"
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
                    className="w-full px-3 py-2 text-sm border border-[#e6f7fa] rounded-md focus:ring-2 focus:ring-[#3e979f] focus:border-[#3e979f] transition"
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

        {/* Opening/Closing time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["opening_time", "closing_time"].map((fieldName) => {
            const field = touristSpotFields.find((f) => f.name === fieldName);
            return field ? (
              <div className="flex flex-col gap-1" key={fieldName}>
                <Label className="text-sm font-semibold text-[#1c5461]">
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

        {/* Description and Rules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["description", "rules"].map((fieldName) => {
            const field = touristSpotFields.find((f) => f.name === fieldName);
            return field ? (
              <div className="flex flex-col gap-1" key={fieldName}>
                <Label className="text-sm font-semibold text-[#1c5461]">
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

        {/* Images */}
        <div>
          <Label className="text-sm font-semibold text-[#1c5461] mb-1 block">
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
          {imageFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {imageFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="w-20 h-20 rounded-lg overflow-hidden border border-[#e6f7fa] bg-gray-50 flex items-center justify-center"
                >
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${idx + 1}`}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 justify-end pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="bg-[#3e979f] hover:bg-[#1c5461] text-white font-semibold px-6 py-2 rounded-lg shadow w-full sm:w-auto"
          >
            {loading ? "Adding..." : "Add Tourist Spot"}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-[#e6f7fa] text-[#1c5461] font-semibold px-6 py-2 rounded-lg w-full sm:w-auto"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
