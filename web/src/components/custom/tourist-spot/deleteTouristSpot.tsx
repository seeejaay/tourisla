import { TouristSpot } from "@/app/static/tourist-spot/useTouristSpotManagerSchema";
import { Button } from "@/components/ui/button";

export default function DeleteTouristSpot({
  touristSpot,
  onDelete,
  onCancel,
}: {
  touristSpot: TouristSpot;
  onDelete: (touristSpotId: string) => void | Promise<void>;
  onCancel: () => void;
}) {
  const handleDelete = () => {
    if (touristSpot && touristSpot.id) {
      onDelete(String(touristSpot.id));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-lg font-semibold">
        Are you sure you want to delete this tourist spot?
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
