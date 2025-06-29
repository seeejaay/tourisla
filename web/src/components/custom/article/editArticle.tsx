"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { articleSchema, Article } from "@/app/static/article/useArticleSchema";

export default function EditArticle({
  article,
  onSave,
  onCancel,
}: {
  article: Article;
  onSave: (update: Article) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Article>({ ...article });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    article.thumbnail_url || null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setThumbnail(file);
    if (file) {
      setForm((prev) => ({
        ...prev,
        thumbnail: file,
      }));
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = articleSchema.safeParse({
      ...form,
      thumbnail_url: "placeholder",
    });
    if (!result.success) {
      setError(result.error.errors[0].message);
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        formData.append(key, val?.toString());
      });

      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}articles/${form.id}`,
        {
          method: "PUT",
          body: formData,
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Failed to update article");

      onSave(form);
    } catch (err) {
      setError("Failed to update article. " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-none shadow-none">
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex flex-col gap-1">
            <Label className="uppercase tracking-widest font-semibold text-xs text-[#3e979f]">
              Thumbnail Image
            </Label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            {preview && (
              <img
                src={preview}
                alt="Thumbnail preview"
                className="mt-2 w-40 rounded border"
              />
            )}
          </div>

          {[
            { name: "title", label: "Title" },
            { name: "body", label: "Content", type: "textarea" },
            { name: "video_url", label: "Video URL" },
            { name: "tags", label: "Tags (comma-separated)" },
          ].map((field) => (
            <div key={field.name} className="flex flex-col gap-1">
              <Label
                htmlFor={field.name}
                className="uppercase tracking-widest font-semibold text-xs text-[#3e979f]"
              >
                {field.label}
              </Label>
              {field.type === "textarea" ? (
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={form[field.name as keyof Article] || ""}
                  onChange={handleChange}
                  className="bg-white border-[#e6f7fa] focus:border-[#3e979f] focus:ring-[#3e979f]"
                />
              ) : (
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type || "text"}
                  value={form[field.name as keyof Article] || ""}
                  onChange={handleChange}
                  className="bg-white border-[#e6f7fa] focus:border-[#3e979f] focus:ring-[#3e979f]"
                />
              )}
            </div>
          ))}

          <div className="flex flex-col gap-1">
            <Label className="uppercase tracking-widest font-semibold text-xs text-[#3e979f]">
              Status
            </Label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border border-[#e6f7fa] rounded px-2 py-2 text-sm bg-white focus:border-[#3e979f] focus:ring-[#3e979f]"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="is_featured"
              checked={form.is_featured}
              onCheckedChange={(checked) =>
                setForm((prev) => ({ ...prev, is_featured: checked }))
              }
            />
            <Label
              htmlFor="is_featured"
              className="text-[#1c5461] font-semibold"
            >
              Featured Article
            </Label>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#3e979f] hover:bg-[#1c5461] text-white font-semibold px-6 py-2 rounded-lg shadow"
            >
              {loading ? "Saving..." : "Save Changes"}
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
