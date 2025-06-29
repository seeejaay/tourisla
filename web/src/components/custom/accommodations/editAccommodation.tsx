import { useState } from "react";
import {
  AccommodationSchema as AccommodationZodSchema,
  Accommodation,
} from "@/app/static/accommodation/accommodationSchema";
import { accommodationFields } from "@/app/static/accommodation/accommodation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function EditAccommodation({
  accommodation,
  onSave,
  onCancel,
}: {
  accommodation: Accommodation;
  onSave: (updatedAccommodation: Accommodation) => void | Promise<void>;
  onCancel: () => void;
}) {
  const REGION = "CEBU";
  const PROVINCE = "CEBU";
  const MUNICIPALITY = "BANTAYAN";

  const [form, setForm] = useState<Accommodation>({
    ...accommodation,
    no_of_rooms: accommodation.no_of_rooms ?? 1,
    no_of_employees: accommodation.no_of_employees ?? 1,
    Year: accommodation.Year ?? 1900,
    Region: REGION,
    Province: PROVINCE,
    municipality: MUNICIPALITY,
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = AccommodationZodSchema.safeParse(form);
    if (!result.success) {
      setError(
        result.error.errors
          .map((err) => `${err.path[0]}: ${err.message}`)
          .join(", ")
      );
      return;
    }

    onSave(form);
  };

  return (
    <Card className="max-w-lg mx-auto shadow-none border-none">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5 ">
          {accommodationFields
            .filter(
              (field) =>
                field.name !== "Region" &&
                field.name !== "Province" &&
                field.name !== "municipality"
            )
            .map((field) => (
              <div className="flex flex-col gap-1" key={field.name}>
                <Label
                  htmlFor={field.name}
                  className="text-[#3e979f] font-semibold"
                >
                  {field.label}
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="bg-white border-[#e6f7fa] focus:border-[#3e979f] focus:ring-[#3e979f]"
                />
              </div>
            ))}
          {/* Show constants as readonly fields */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="Region" className="text-[#3e979f] font-semibold">
              Region
            </Label>
            <Input
              id="Region"
              name="Region"
              value={REGION}
              readOnly
              disabled
              className="bg-gray-100 border-[#e6f7fa] text-gray-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="Province" className="text-[#3e979f] font-semibold">
              Province
            </Label>
            <Input
              id="Province"
              name="Province"
              value={PROVINCE}
              readOnly
              disabled
              className="bg-gray-100 border-[#e6f7fa] text-gray-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="municipality"
              className="text-[#3e979f] font-semibold"
            >
              Municipality
            </Label>
            <Input
              id="municipality"
              name="municipality"
              value={MUNICIPALITY}
              readOnly
              disabled
              className="bg-gray-100 border-[#e6f7fa] text-gray-500"
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </div>
          )}
          <div className="flex gap-3 pt-6 justify-end">
            <Button
              type="submit"
              className="bg-[#3e979f] hover:bg-[#1c5461] text-white font-semibold px-6 py-2 rounded-lg shadow"
            >
              Save
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-[#e6f7fa] text-[#1c5461] font-semibold px-6 py-2 rounded-lg"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
