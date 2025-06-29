import { useState } from "react";
import {
  hotlineSchema,
  Hotline,
} from "@/app/static/hotline/useHotlineManagerSchema";
import { hotlineFields } from "@/app/static/hotline/hotline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EditHotline({
  hotline,
  onSave,
  onCancel,
}: {
  hotline: Hotline;
  onSave: (updatedHotline: Hotline) => void | Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Hotline>({ ...hotline });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate with Zod schema
    const result = hotlineSchema.safeParse(form);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    onSave(form);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-xl  p-6 space-y-5">
        {hotlineFields.map((field) => (
          <div key={field.name}>
            <Label
              htmlFor={field.name}
              className="block text-sm font-semibold mb-1 text-[#1c5461]"
            >
              {field.label}
            </Label>
            {field.type === "select" ? (
              <select
                id={field.name}
                name={field.name}
                value={form[field.name as keyof Hotline] ?? ""}
                onChange={handleChange}
                required={field.name !== "address"}
                className="border border-[#e6f7fa] rounded px-2 py-2 text-sm w-full bg-white focus:border-[#3e979f] focus:ring-[#3e979f]"
              >
                <option value="">Select {field.label}</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                id={field.name}
                name={field.name}
                value={form[field.name as keyof Hotline] ?? ""}
                onChange={handleChange}
                placeholder={field.placeholder}
                required={field.name !== "address"}
                className="bg-white border-[#e6f7fa] focus:border-[#3e979f] focus:ring-[#3e979f]"
              />
            )}
          </div>
        ))}
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <div className="flex gap-2 justify-end pt-2">
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
    </div>
  );
}
