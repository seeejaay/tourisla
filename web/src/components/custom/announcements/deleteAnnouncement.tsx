import { Announcement } from "./columns";
import { Button } from "@/components/ui/button";

export default function DeleteAnnouncement({
  announcement,
  onDelete,
  onCancel,
}: {
  announcement: Announcement;
  onDelete: (announcementId: string) => void | Promise<void>;
  onCancel: () => void;
}) {
  const handleDelete = () => {
    if (announcement && announcement.id) {
      onDelete(announcement.id);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 border-[#e6f7fa] w-full max-w-md">
      <p className="text-base text-[#1c5461] font-semibold mb-1 text-center">
        {announcement?.title}
      </p>
      <p className="text-sm text-gray-500 mb-4 text-center">
        Are you sure you want to delete this announcement? <br />
        <span className="font-medium text-[#c0392b]">
          This action cannot be undone.
        </span>
      </p>
      <div className="flex gap-3 justify-center">
        <Button
          variant="destructive"
          onClick={handleDelete}
          className="px-6 py-2 font-semibold rounded-lg"
        >
          Delete
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          className="border-[#e6f7fa] text-[#1c5461] font-semibold px-6 py-2 rounded-lg"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
