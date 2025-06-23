import { useState, useEffect } from "react";
import { useAccommodationManager } from "@/hooks/useAccommodationManager";
import { Accommodation } from "@/app/static/accommodation/accommodationSchema";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface AssignAccommodationProps {
  staff: { user_id: string; first_name: string; last_name: string };
  onAssigned: () => void;
  onCancel: () => void;
}

export default function AssignAccommodation({
  staff,
  onAssigned,
  onCancel,
}: AssignAccommodationProps) {
  const {
    accommodations,
    fetchAccommodations,
    assignAccommodationToStaff,
    loading,
    error,
  } = useAccommodationManager();
  const [selectedAccommodationId, setSelectedAccommodationId] =
    useState<string>("");

  useEffect(() => {
    const fetchALlAccommodations = async () => {
      await fetchAccommodations();
    };
    fetchALlAccommodations();
  }, [fetchAccommodations]);

  const handleAssign = async () => {
    if (selectedAccommodationId === "") return;
    if (selectedAccommodationId === "none") {
      // Call your API to unassign the staff from any accommodation
      const success = await assignAccommodationToStaff(
        Number(staff.user_id),
        null
      );
      if (success) {
        onAssigned();
      }
      return;
    }
    const success = await assignAccommodationToStaff(
      Number(staff.user_id),
      Number(selectedAccommodationId) || null
    );
    if (success) {
      onAssigned();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label>
          Assign accommodation to:{" "}
          <span className="font-semibold">
            {staff.first_name} {staff.last_name}
          </span>
        </Label>
      </div>
      <div>
        <Label htmlFor="accommodation">Accommodation</Label>
        <select
          id="accommodation"
          className="w-full border rounded px-3 py-2 mt-1"
          value={selectedAccommodationId}
          onChange={(e) => setSelectedAccommodationId(e.target.value)}
          disabled={loading}
        >
          <option value="">Select accommodation...</option>
          <option value="none">Remove assignment</option>
          {accommodations.map((acc: Accommodation) => (
            <option key={acc.id} value={String(acc.id)}>
              {acc.name_of_establishment}
            </option>
          ))}
        </select>
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <div className="flex gap-2 justify-end">
        <Button
          variant="default"
          onClick={handleAssign}
          disabled={loading || !selectedAccommodationId}
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
