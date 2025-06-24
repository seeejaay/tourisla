import { useState, useEffect } from "react";
import { useTouristSpotManager } from "@/hooks/useTouristSpotManager";
import { TouristSpot } from "@/app/static/tourist-spot/useTouristSpotManagerSchema";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface AssignTouristSpotProps {
  staff: { user_id: string; first_name: string; last_name: string };
  onAssigned: () => void;
  onCancel: () => void;
}

export default function AssignTouristSpot({
  staff,
  onAssigned,
  onCancel,
}: AssignTouristSpotProps) {
  const {
    touristSpots,
    fetchTouristSpots,
    assignAttractionToStaff,
    loading,
    error,
  } = useTouristSpotManager();
  const [selectedSpotId, setSelectedSpotId] = useState<string>("");

  useEffect(() => {
    fetchTouristSpots();
  }, [fetchTouristSpots]);

  const handleAssign = async () => {
    if (selectedSpotId === "") return;
    if (selectedSpotId === "none") {
      // Unassign staff from any tourist spot
      const success = await assignAttractionToStaff(
        Number(staff.user_id),
        null
      );
      if (success) {
        onAssigned();
      }
      return;
    }
    const success = await assignAttractionToStaff(
      Number(staff.user_id),
      Number(selectedSpotId)
    );
    if (success) {
      onAssigned();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label>
          Assign tourist spot to:{" "}
          <span className="font-semibold">
            {staff.first_name} {staff.last_name}
          </span>
        </Label>
      </div>
      <div>
        <Label htmlFor="touristspot">Tourist Spot</Label>
        <select
          id="touristspot"
          className="w-full border rounded px-3 py-2 mt-1"
          value={selectedSpotId}
          onChange={(e) => setSelectedSpotId(e.target.value)}
          disabled={loading}
        >
          <option value="">Select tourist spot...</option>
          <option value="none">Remove assignment</option>
          {touristSpots.map((spot: TouristSpot) => (
            <option key={spot.id} value={String(spot.id)}>
              {spot.name}
            </option>
          ))}
        </select>
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <div className="flex gap-2 justify-end">
        <Button
          variant="default"
          onClick={handleAssign}
          disabled={loading || !selectedSpotId}
        >
          Assign
        </Button>
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
