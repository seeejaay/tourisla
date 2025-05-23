import { useState } from "react";
import { Announcement } from "./columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { announcementSchema } from "@/app/static/announcement/useAnnouncementManagerSchema";

export default function EditAnnouncement({
  announcement,
  onSave,
  onCancel,
}: {
  announcement: Announcement;
  onSave: (updatedAnnouncement: Announcement) => void | Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Announcement>({
    ...announcement,
    id: String(announcement.id),
  });
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate with Zod schema (regex included)
    const result = announcementSchema.safeParse(form);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    onSave(form);
  };

  return (
    <Card className="max-w-lg mx-auto">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6 py-6">
          <div className="flex flex-col gap-1">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="date_posted">Date Posted</Label>
            <Input
              id="date_posted"
              type="date"
              name="date_posted"
              value={form.date_posted}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              type="text"
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
            />
          </div>
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
