import { useState, useRef } from "react";
import { Announcement } from "./columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { announcementSchema } from "@/app/static/announcement/useAnnouncementManagerSchema";
import categories from "@/app/static/announcement/category.json";

export default function EditAnnouncement({
  announcement,
  onSave,
  onCancel,
}: {
  announcement: Announcement;
  onSave: (
    updatedAnnouncement: Announcement | FormData
  ) => void | Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Announcement>({
    ...announcement,
    id: announcement.id ? String(announcement.id) : "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type, files } = e.target as HTMLInputElement;
    if (type === "file" && files && files[0]) {
      setImageFile(files[0]);
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = announcementSchema.safeParse(form);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    let updateData: Announcement | FormData;
    if (imageFile) {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key !== "id") {
          formData.append(key, value ?? "");
        }
      });
      formData.append("image", imageFile);
      updateData = formData;
    } else {
      const { ...rest } = form;
      updateData = rest as Announcement;
    }

    await onSave(updateData);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-xl  p-4 space-y-5">
        <div>
          <Label htmlFor="title" className="text-[#1c5461] font-semibold mb-1">
            Title
          </Label>
          <Input
            id="title"
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="bg-white border-[#e6f7fa] focus:border-[#3e979f] focus:ring-[#3e979f]"
          />
        </div>
        <div>
          <Label
            htmlFor="description"
            className="text-[#1c5461] font-semibold mb-1"
          >
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            required
            className="bg-white border-[#e6f7fa] focus:border-[#3e979f] focus:ring-[#3e979f] min-h-[100px]"
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Label
              htmlFor="date_posted"
              className="text-[#1c5461] font-semibold mb-1"
            >
              Date Posted
            </Label>
            <Input
              id="date_posted"
              type="date"
              name="date_posted"
              value={form.date_posted}
              onChange={handleChange}
              required
              className="bg-white border-[#e6f7fa] focus:border-[#3e979f] focus:ring-[#3e979f]"
            />
          </div>
          <div className="flex-1">
            <Label
              htmlFor="location"
              className="text-[#1c5461] font-semibold mb-1"
            >
              Location
            </Label>
            <Input
              id="location"
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="bg-white border-[#e6f7fa] focus:border-[#3e979f] focus:ring-[#3e979f]"
            />
          </div>
        </div>
        <div>
          <Label
            htmlFor="category"
            className="text-[#1c5461] font-semibold mb-1"
          >
            Category
          </Label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border border-[#e6f7fa] rounded px-2 py-2 text-sm w-full bg-white focus:border-[#3e979f] focus:ring-[#3e979f]"
            required
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
          <Label
            htmlFor="image_url"
            className="text-[#1c5461] font-semibold mb-1"
          >
            Image
          </Label>
          {form.image_url && (
            <img
              src={form.image_url}
              alt="Announcement"
              className="mb-2 max-h-48 object-contain rounded"
            />
          )}
          <Input
            id="image_url"
            type="file"
            name="image_url"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleChange}
            className="bg-white border-[#e6f7fa] focus:border-[#3e979f] focus:ring-[#3e979f] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-[#e6f7fa] file:text-[#1c5461]"
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <div className="flex gap-2 justify-end pt-2">
          <Button
            type="submit"
            className="bg-[#3e979f] hover:bg-[#1c5461] text-white font-semibold px-6 py-2 rounded-lg shadow"
          >
            Save
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
    </div>
  );
}
