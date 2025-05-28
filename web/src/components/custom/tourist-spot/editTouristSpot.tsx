import { useState } from "react";
import { TouristSpot } from "@/app/static/tourist-spot/useTouristSpotManagerSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
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
  const [imageFile, setImageFile] = useState<File | null>(null);

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
    const file = e.target.files?.[0];
    setImageFile(file || null);
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

    // If image is changed, use FormData
    if (imageFile) {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append("image", imageFile);
      onSave(formData);
    } else {
      onSave(form);
    }
  };

  return (
    <Card className="max-w-lg mx-auto">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6 py-6">
          {touristSpotFields.map((field) => (
            <div className="flex flex-col gap-1" key={field.name}>
              <Label htmlFor={field.name}>{field.label}</Label>
              {field.type === "textarea" ? (
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.name}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  rows={4}
                />
              ) : field.type === "select" ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={field.name}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
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
              ) : field.type === "file" ? (
                <Input
                  id={field.name}
                  type="file"
                  name={field.name}
                  accept={field.accept}
                  onChange={handleImageChange}
                />
              ) : (
                <Input
                  id={field.name}
                  type={field.type}
                  name={field.name}
                  value={field.name}
                  onChange={handleChange}
                  placeholder={field.placeholder}
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
