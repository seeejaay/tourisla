"use client";

import { useState } from "react";
import { useArticleManager } from "@/hooks/useArticleManager";
import { articleFields } from "@/app/static/article/articleFields";
import { articleSchema } from "@/app/static/article/useArticleSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function AddArticle({
  onSuccess,
  onCancel,
  currentUser,
}: {
  onSuccess?: () => void;
  onCancel?: () => void;
  currentUser: string; // Pass logged in username or user id
}) {
  const [form, setForm] = useState({
    title: "",
    author: currentUser,
    published_date: "",
    published_at: "",
    body: "",
    video_url: "",
    thumbnail_url: "",
    tags: "",
    status: "DRAFT",
    is_featured: false,
    updated_by: currentUser,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { add } = useArticleManager();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      is_featured: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = articleSchema.safeParse(form);
    if (!result.success) {
      setError(result.error.errors[0].message);
      setLoading(false);
      return;
    }

    try {
      await add(form);
      onSuccess?.();
    } catch (err) {
      setError("Failed to create article. " + (err as any)?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500 text-sm">{error}</div>}

      {articleFields.map((field) => (
        <div key={field.name} className="flex flex-col gap-1">
          <Label htmlFor={field.name}>{field.label}</Label>

          {field.type === "textarea" ? (
            <Textarea
              id={field.name}
              name={field.name}
              value={form[field.name as keyof typeof form] as string}
              onChange={handleChange}
              placeholder={field.placeholder}
              required={field.name !== "video_url" && field.name !== "tags"}
              className="w-full border rounded px-2 py-1 min-h-[100px]"
            />
          ) : field.type === "select" ? (
            <select
              id={field.name}
              name={field.name}
              value={form[field.name as keyof typeof form] as string}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            >
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : field.type === "checkbox" ? (
            <div className="flex items-center gap-2">
              <Checkbox
                id={field.name}
                checked={form.is_featured}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor={field.name}>Mark as Featured</Label>
            </div>
          ) : (
            <Input
              id={field.name}
              name={field.name}
              value={form[field.name as keyof typeof form] as string}
              onChange={handleChange}
              type={field.type}
              placeholder={field.placeholder}
              required={
                field.name !== "video_url" && field.name !== "tags"
              }
            />
          )}
        </div>
      ))}

      <div className="flex gap-2 justify-end pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add Article"}
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
