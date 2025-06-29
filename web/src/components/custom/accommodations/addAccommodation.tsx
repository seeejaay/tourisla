"use client";

import { useState } from "react";
import { useAccommodationManager } from "@/hooks/useAccommodationManager";
import { AccommodationSchema } from "@/app/static/accommodation/accommodationSchema";
import { accommodationFields } from "@/app/static/accommodation/accommodation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddAccommodation({
  onSuccess,
  onCancel,
}: {
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  // Set constants
  const REGION = "CEBU";
  const PROVINCE = "CEBU";
  const MUNICIPALITY = "BANTAYAN";

  const [form, setForm] = useState<AccommodationSchema>({
    name_of_establishment: "",
    Type: "",
    no_of_rooms: 1,
    number_of_employees: 1,
    Year: 1900,
    Region: REGION,
    Province: PROVINCE,
    municipality: MUNICIPALITY,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createAccommodation } = useAccommodationManager();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => {
      let newValue = value;
      if (type === "number") {
        newValue = Math.max(1, Number(value));
      }
      return {
        ...prev,
        [name]: newValue,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = AccommodationSchema.safeParse(form);
    if (!result.success) {
      setError(result.error.errors[0].message);
      setLoading(false);
      return;
    }

    try {
      await createAccommodation(form);
      onSuccess?.();
    } catch (err) {
      setError("Failed to create accommodation. " + err);
    } finally {
      setLoading(false);
    }
  };

  // Ensure "Number of Employees" is included in the left or right column
  const leftFields = [
    "name_of_establishment",
    "Type",
    "no_of_rooms",
    "number_of_employees", // <-- Add this line
  ]
    .map((name) => accommodationFields.find((f) => f.name === name))
    .filter(Boolean);

  const rightFields = ["Year", "Region", "Province", "municipality"]
    .map((name) => accommodationFields.find((f) => f.name === name))
    .filter(Boolean);

  return (
    <main className="w-full">
      <div className="p-8 space-y-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-red-500 text-sm">{error}</div>}

          {/* Two columns using accommodationFields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-4">
              {leftFields.map((field) => (
                <div key={field!.name}>
                  <Label
                    htmlFor={field!.name}
                    className="block font-semibold mb-2 text-[#1c5461]"
                  >
                    {field!.label}
                  </Label>
                  <Input
                    id={field!.name}
                    name={field!.name}
                    type={field!.type}
                    value={form[field!.name]}
                    onChange={handleChange}
                    placeholder={field!.placeholder}
                    required={field!.required}
                    className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                  />
                </div>
              ))}
            </div>
            {/* Right column */}
            <div className="space-y-4">
              {rightFields.map((field) => (
                <div key={field!.name}>
                  <Label
                    htmlFor={field!.name}
                    className="block font-semibold mb-2 text-[#1c5461]"
                  >
                    {field!.label}
                  </Label>
                  <Input
                    id={field!.name}
                    name={field!.name}
                    type={field!.type}
                    value={form[field!.name]}
                    onChange={handleChange}
                    placeholder={field!.placeholder}
                    required={field!.required}
                    readOnly={
                      field!.name === "Region" ||
                      field!.name === "Province" ||
                      field!.name === "municipality"
                    }
                    disabled={
                      field!.name === "Region" ||
                      field!.name === "Province" ||
                      field!.name === "municipality"
                    }
                    className={`w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd] ${
                      field!.name === "Region" ||
                      field!.name === "Province" ||
                      field!.name === "municipality"
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#3e979f] text-white hover:bg-[#1c5461] transition"
          >
            {loading ? "Adding..." : "Add Accommodation"}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="w-full"
            >
              Cancel
            </Button>
          )}
        </form>
      </div>
    </main>
  );
}
