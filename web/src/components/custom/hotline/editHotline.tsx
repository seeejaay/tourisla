import { useState } from "react";
import {
  hotlineSchema,
  Hotline,
} from "@/app/static/hotline/useHotlineManagerSchema";
import { hotlineFields } from "@/app/static/hotline/hotline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

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
    <Card className="max-w-lg mx-auto">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6 py-6">
          {hotlineFields.map((field) => (
            <div className="flex flex-col gap-1" key={field.name}>
              <Label htmlFor={field.name}>{field.label}</Label>
              {field.type === "select" ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={form[field.name as keyof Hotline] ?? ""}
                  onChange={handleChange}
                  required={field.name !== "address"}
                  className="w-full border rounded px-2 py-1"
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
                />
              )}
            </div>
          ))}
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex gap-4 pt-6 justify-end">
            <Button type="submit" variant="default">
              Save
            </Button>
            <Button type="button" variant="destructive" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
