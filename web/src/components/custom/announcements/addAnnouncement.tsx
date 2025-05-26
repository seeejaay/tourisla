"use client";

import { useState } from "react";
import { useAnnouncementManager } from "@/hooks/useAnnouncementManager";
import { announcementSchema } from "@/app/static/announcement/useAnnouncementManagerSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AddAnnouncement({
  onSuccess,
  onCancel,
}: {
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const today = new Date(Date.now() + 8 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const [form, setForm] = useState({
    title: "",
    description: "",
    date_posted: today,
    location: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { createAnnouncement } = useAnnouncementManager();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate with Zod schema (skip image_url, backend will set it)
    const result = announcementSchema.safeParse({ ...form, image_url: "" });
    if (!result.success) {
      setError(result.error.errors[0].message);
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (imageFile) {
        formData.append("image", imageFile);
      }

      // Pass FormData to createAnnouncement (your API must support FormData)
      const created = await createAnnouncement(formData);
      if (!created) {
        setError("Failed to create announcement.");
        return;
      }
      setForm({
        title: "",
        description: "",
        date_posted: today,
        location: "",
        category: "",
      });
      setImageFile(null);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError("Failed to create announcement. " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold mb-1">Title</label>
        <Input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
      </div>
      <div>
        <label className="block text-xs font-semibold mb-1">Description</label>
        <Textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />
      </div>
      <div>
        <label className="block text-xs font-semibold mb-1">Date Posted</label>
        <Input
          type="date"
          name="date_posted"
          value={form.date_posted}
          onChange={handleChange}
          required
          readOnly
          className="cursor-not-allowed"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold mb-1">Location</label>
        <Input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold mb-1">Category</label>
        <Input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold mb-1">Image</label>
        <Input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="flex gap-2 justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Announcement"}
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
