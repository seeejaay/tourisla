import { Button } from "@/components/ui/button";
import type { AccommodationLog } from "@/app/static/accommodation/accommodationlogSchema";

export default function DeleteAccommodationLog({
  log,
  onDelete,
  onCancel,
}: {
  log: AccommodationLog;
  onDelete: (logId: number) => void | Promise<void>;
  onCancel: () => void;
}) {
  const handleDelete = () => {
    if (log && log.id !== undefined) {
      onDelete(log.id);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-lg font-semibold">
        Are you sure you want to delete this log?
      </h2>
      <p className="text-sm text-gray-500">This action cannot be undone.</p>
      <div className="flex gap-4 mt-4">
        <Button variant="destructive" onClick={handleDelete}>
          Delete
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
