"use client";

import { useState } from "react";
import { useAnnouncementManager } from "@/hooks/useAnnouncementManager";
import { announcementSchema } from "@/app/static/announcement/useAnnouncementManagerSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import categories from "@/app/static/announcement/category.json";

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
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
    <div className="w-full flex flex-col items-center justify-start p-0 ">
      <form onSubmit={handleSubmit} className="w-full max-w-xl p-6 space-y-8">
        <div>
          <label className="block text-sm font-semibold mb-1 text-[#1c5461]">
            Title
          </label>
          <Input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            required
            className="bg-white border-[#e6f7fa] focus:border-[#3e979f] focus:ring-[#3e979f]"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-[#1c5461]">
            Description
          </label>
          <Textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            required
            className="bg-white border-[#e6f7fa] focus:border-[#3e979f] focus:ring-[#3e979f] min-h-[100px]"
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1 text-[#1c5461]">
              Date Posted
            </label>
            <Input
              type="date"
              name="date_posted"
              value={form.date_posted}
              onChange={handleChange}
              required
              readOnly
              className="cursor-not-allowed bg-gray-100 border-[#e6f7fa]"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1 text-[#1c5461]">
              Location
            </label>
            <Input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Location"
              className="bg-white border-[#e6f7fa] focus:border-[#3e979f] focus:ring-[#3e979f]"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-[#1c5461]">
            Category
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleSelectChange}
            required
            className="border border-[#e6f7fa] rounded px-2 py-2 text-sm w-full bg-white focus:border-[#3e979f] focus:ring-[#3e979f]"
          >
            <option value="">Select category</option>
            {categories.map((cat: string) => (
              <option key={cat} value={cat}>
                {cat.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-[#1c5461]">
            Image
          </label>
          <Input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="bg-white border-[#e6f7fa] focus:border-[#3e979f] focus:ring-[#3e979f] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-[#e6f7fa] file:text-[#1c5461]"
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <div className="flex gap-2 justify-end pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="bg-[#3e979f] hover:bg-[#1c5461] text-white font-semibold px-6 py-2 rounded-lg shadow"
          >
            {loading ? "Adding..." : "Add Announcement"}
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
