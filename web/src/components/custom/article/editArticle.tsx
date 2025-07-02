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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(
    article.images?.map((img) => img.image_url) || []
  );

  // Handle image file selection and previews
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setImageFiles(files);

    // Generate previews for new files
    if (files.length > 0) {
      const fileReaders: FileReader[] = [];
      const newPreviews: string[] = [];
      files.forEach((file, idx) => {
        const reader = new FileReader();
        fileReaders.push(reader);
        reader.onload = (ev) => {
          newPreviews[idx] = ev.target?.result as string;
          // Only update previews when all files are loaded
          if (newPreviews.filter(Boolean).length === files.length) {
            setPreviews([
              ...(article.images?.map((img) => img.image_url) || []),
              ...newPreviews,
            ]);
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      setPreviews(article.images?.map((img) => img.image_url) || []);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Always set updated_by before validation
    const formWithUpdater = { ...form, updated_by: form.updated_by || "ADMIN" };

    // ...rest of your code, but use formWithUpdater instead of form...
    const hasExistingImage =
      formWithUpdater.images &&
      formWithUpdater.images.length > 0 &&
      formWithUpdater.images[0].image_url;
    if (imageFiles.length === 0 && !hasExistingImage) {
      setError("At least one image is required.");
      setLoading(false);
      return;
    }

    const formForValidation = { ...formWithUpdater };
    if (imageFiles.length > 0) {
      delete formForValidation.images;
    }
    const result = articleSchema.safeParse(formForValidation);
    if (!result.success) {
      setError(result.error.errors.map((e) => e.message).join(", "));
      setLoading(false);
      return;
    }

    const dataToSend = {
      ...formWithUpdater,
      images: imageFiles.length > 0 ? imageFiles : formWithUpdater.images,
    };

    try {
      await onSave(dataToSend as Article);
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
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

          {/* Hidden required fields */}
          <Input type="hidden" name="author" value={form.author} />
          <Input type="hidden" name="updated_by" value={form.updated_by} />

          <div className="flex flex-col gap-1">
            <Label className="uppercase tracking-widest font-semibold text-xs text-[#3e979f]">
              Images <span className="text-red-500">*</span>
            </Label>
            <Input
              id="images"
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
            {/* Show existing images */}
            {form.images &&
              Array.isArray(form.images) &&
              form.images.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-gray-500">Current Images</p>
                  <div className="flex flex-wrap gap-2">
                    {form.images.map((image, idx: number) => (
                      <div
                        key={idx}
                        className="relative aspect-square w-24 h-24 rounded-md overflow-hidden border border-gray-200"
                      >
                        <img
                          src={image.image_url.replace(/\s/g, "")}
                          alt={`Article Image ${idx + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            {/* Show previews for new images */}
            {imageFiles.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {previews
                  .slice(-imageFiles.length)
                  .map(
                    (src, idx) =>
                      src && (
                        <img
                          key={idx}
                          src={src}
                          alt={`Preview ${idx + 1}`}
                          className="w-24 h-24 object-cover rounded border"
                        />
                      )
                  )}
              </div>
            )}
          </div>

          {/* Main fields */}
          {[
            { name: "title", label: "Title" },
            { name: "content", label: "Content", type: "textarea" },
            { name: "video_url", label: "Video URL" },
            { name: "tags", label: "Tags (comma-separated)" },
            { name: "type", label: "Type" },
            { name: "barangay", label: "Barangay" },
            { name: "summary", label: "Summary", type: "textarea" },
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
                  value={form[field.name as keyof Article] || ""}
                  onChange={handleChange}
                  type={field.type || "text"}
                  className="bg-white border-[#e6f7fa] focus:border-[#3e979f] focus:ring-[#3e979f]"
                />
              )}
            </div>
          ))}

          {/* is_published checkbox */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="is_published"
              checked={!!form.is_published}
              onCheckedChange={(checked) =>
                setForm((prev) => ({ ...prev, is_published: !!checked }))
              }
            />
            <Label
              htmlFor="is_published"
              className="text-[#1c5461] font-semibold"
            >
              Published
            </Label>
          </div>

          {/* is_featured checkbox */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="is_featured"
              checked={!!form.is_featured}
              onCheckedChange={(checked) =>
                setForm((prev) => ({ ...prev, is_featured: !!checked }))
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
