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
    no_of_rooms: 1, // Set to minimum valid value
    no_of_employees: 1, // Set to minimum valid value
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
      let newValue: string | number = value;
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

    // Validate with Zod schema
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {accommodationFields
        .filter(
          (field) =>
            field.name !== "Region" &&
            field.name !== "Province" &&
            field.name !== "municipality"
        )
        .map((field) => (
          <div key={field.name}>
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              name={field.name}
              type={field.type}
              value={form[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              required
            />
          </div>
        ))}
      {/* Show constants as readonly fields */}
      <div>
        <Label htmlFor="Region">Region</Label>
        <Input id="Region" name="Region" value={REGION} readOnly disabled />
      </div>
      <div>
        <Label htmlFor="Province">Province</Label>
        <Input
          id="Province"
          name="Province"
          value={PROVINCE}
          readOnly
          disabled
        />
      </div>
      <div>
        <Label htmlFor="municipality">Municipality</Label>
        <Input
          id="municipality"
          name="municipality"
          value={MUNICIPALITY}
          readOnly
          disabled
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Accommodation"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
