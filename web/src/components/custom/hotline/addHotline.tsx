import { useState } from "react";
import { useHotlineManager } from "@/hooks/useHotlineManager";
import { hotlineSchema } from "@/app/static/hotline/useHotlineManagerSchema";
import { hotlineFields } from "@/app/static/hotline/hotline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddHotline({
  onSuccess,
  onCancel,
}: {
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState<{
    municipality: "SANTA_FE" | "BANTAYAN" | "MADRIDEJOS";
    type: "MEDICAL" | "POLICE" | "BFP" | "NDRRMO" | "COAST_GUARD";
    contact_number: string;
    address: string;
  }>({
    municipality: "BANTAYAN",
    type: "MEDICAL",
    contact_number: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createHotline } = useHotlineManager();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate with Zod schema
    const result = hotlineSchema.safeParse(form);
    if (!result.success) {
      setError(result.error.errors[0].message);
      setLoading(false);
      return;
    }

    try {
      await createHotline(form);
      onSuccess?.();
    } catch (err) {
      setError("Failed to create hotline. " + err);
    } finally {
      setLoading(false);
    }
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
                value={form[field.name as keyof typeof form]}
                onChange={handleChange}
                required
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
                value={form[field.name as keyof typeof form]}
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
            disabled={loading}
            className="bg-[#3e979f] hover:bg-[#1c5461] text-white font-semibold px-6 py-2 rounded-lg shadow"
          >
            {loading ? "Adding..." : "Add Hotline"}
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
