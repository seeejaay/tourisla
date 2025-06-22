import React, { useState } from "react";
import { useTourPackageManager } from "@/hooks/useTourPackageManager";
import { Button } from "@/components/ui/button";

interface DeleteTourPackageProps {
  id: number | string;
  onDeleted?: () => void;
}

export default function DeleteTourPackage({
  id,
  onDeleted,
}: DeleteTourPackageProps) {
  const { remove, loading, error } = useTourPackageManager();
  const [confirm, setConfirm] = useState(false);

  const handleDelete = async () => {
    if (!confirm) {
      setConfirm(true);
      return;
    }
    const success = await remove(id);
    if (success && onDeleted) onDeleted();
  };

  return (
    <div>
      <Button
        variant={confirm ? "destructive" : "outline"}
        onClick={handleDelete}
        disabled={loading}
      >
        {loading ? "Deleting..." : confirm ? "Confirm Delete" : "Delete"}
      </Button>
      {confirm && (
        <span className="ml-2 text-sm text-red-600">Are you sure?</span>
      )}
      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
    </div>
  );
}
