"use client";

import { useState } from "react";
import { articleSchema, Article } from "@/app/static/article/useArticleSchema";
import { articleFields } from "@/app/static/article/articleFields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

export default function EditArticle({
  article,
  onSave,
  onCancel,
}: {
  article: Article;
  onSave: (updated: Article) => void | Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Article>({ ...article });
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = articleSchema.safeParse(form);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    onSave(form);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardContent className="py-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {articleFields.map((field) => (
            <div key={field.name} className="flex flex-col gap-1">
              <Label htmlFor={field.name}>{field.label}</Label>
              {field.type === "textarea" ? (
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={form[field.name as keyof Article] as string}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={field.name !== "video_url" && field.name !== "tags"}
                />
              ) : field.type === "select" ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={form[field.name as keyof Article] as string}
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
                  value={form[field.name as keyof Article] as string}
                  onChange={handleChange}
                  type={field.type}
                  placeholder={field.placeholder}
                  required={field.name !== "video_url" && field.name !== "tags"}
                />
              )}
            </div>
          ))}
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="submit">Save</Button>
            <Button type="button" variant="destructive" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
