"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { articleSchema } from "@/app/static/article/useArticleSchema";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function AddArticle({
  onSuccess,
  onCancel,
}: {
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const { loggedInUser } = useAuth();

  const [form, setForm] = useState({
    title: "",
    author: "",
    content: "",
    video_url: "",
    tags: "",
    type: "",
    is_published: false,
    is_featured: false,
    barangay: "",
    summary: "",
    updated_by: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [userLoading, setUserLoading] = useState(true);

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      const res = await loggedInUser(router);
      if (
        res &&
        res.data &&
        res.data.user &&
        res.data.user.first_name &&
        res.data.user.last_name
      ) {
        const fullName =
          res.data.user.first_name + " " + res.data.user.last_name;
        setForm((prev) => ({
          ...prev,
          author: fullName,
          updated_by: fullName,
        }));
      }
      setUserLoading(false);
    };
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Prevent form from rendering until user is loaded
  if (userLoading) {
    return <div className="text-center py-10">Loading user...</div>;
  }

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

  // Handle multiple image selection and preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setImages(files);

    // Generate previews
    const filePreviews: string[] = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        filePreviews.push(reader.result as string);
        if (filePreviews.length === files.length) {
          setPreviews([...filePreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
    if (files.length === 0) setPreviews([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = articleSchema.safeParse({
      ...form,
      images,
    });
    if (!result.success) {
      setError(result.error.errors[0].message);
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        formData.append(key, val.toString());
      });

      images.forEach((file) => {
        formData.append("images", file);
      });

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}articles`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to create article");

      onSuccess?.();
    } catch (err) {
      setError("Failed to submit article. " + err);
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
              Images <span className="text-red-500">*</span>
            </Label>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              required
            />
            {previews.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {previews.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`Preview ${idx + 1}`}
                    className="w-24 h-24 object-cover rounded border"
                  />
                ))}
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
                  value={form[field.name as keyof typeof form]}
                  onChange={handleChange}
                  required={field.name !== "video_url" && field.name !== "tags"}
                  className="bg-white border-[#e6f7fa] focus:border-[#3e979f] focus:ring-[#3e979f]"
                />
              ) : (
                <Input
                  id={field.name}
                  name={field.name}
                  value={form[field.name as keyof typeof form]}
                  onChange={handleChange}
                  type={field.type || "text"}
                  required={field.name !== "video_url" && field.name !== "tags"}
                  className="bg-white border-[#e6f7fa] focus:border-[#3e979f] focus:ring-[#3e979f]"
                />
              )}
            </div>
          ))}

          {/* is_published checkbox */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="is_published"
              checked={form.is_published}
              onCheckedChange={(checked) =>
                setForm((prev) => ({ ...prev, is_published: checked }))
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
              {loading ? "Saving..." : "Add Article"}
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
      </CardContent>
    </Card>
  );
}
