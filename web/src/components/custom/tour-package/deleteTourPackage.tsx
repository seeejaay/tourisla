import React, { useState } from "react";
import { useTourPackageManager } from "@/hooks/useTourPackageManager";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
interface DeleteTourPackageProps {
  id: number | string;
  onDeleted?: () => void;
  disabled?: boolean;
}

export default function DeleteTourPackage({
  id,
  onDeleted,
  disabled = false,
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
    <>
      <Button
        variant="destructive"
        onClick={() => setConfirm(true)}
        disabled={loading || disabled}
        className="cursor-pointer"
      >
        <Trash2 />
        Delete
      </Button>
      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this tour package?
            </DialogDescription>
          </DialogHeader>
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setConfirm(false)}
              disabled={loading}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
              className="cursor-pointer hover:bg-red-700"
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
