"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import type { Price } from "@/app/static/price/usePriceSchema";
import { usePriceManager } from "@/hooks/usePriceManager";

export default function ViewPrice({ price }: { price: Price }) {
  const { updateStatus, editPriceDetails } = usePriceManager();
  const [openEdit, setOpenEdit] = useState(false);
  const [editedAmount, setEditedAmount] = useState(price.amount);
  const [editedType, setEditedType] = useState(price.type || "");

  const handleToggle = async () => {
    try {
      await updateStatus(price.id, !price.is_enabled);
      alert("Status updated.");
    } catch {
      alert("Failed to update price status.");
    }
  };

  const handleEditSubmit = async () => {
    try {
      await editPriceDetails(price.id, editedAmount, editedType);
      alert("Price updated.");
      setOpenEdit(false);
    } catch {
      alert("Failed to update price.");
    }
  };

  return (
    <Card className="p-5 space-y-3 border rounded shadow">
      <h3 className="text-xl font-bold text-blue-700">₱{price.amount}</h3>
      <p className="text-sm text-gray-700">
        <strong>Type:</strong> {price.type || "—"}
      </p>
      <p className="text-sm">
        <strong>Status:</strong>{" "}
        <span className={price.is_enabled ? "text-green-600" : "text-red-500"}>
          {price.is_enabled ? "Enabled" : "Disabled"}
        </span>
      </p>

      <div className="flex gap-2">
        <button
          onClick={handleToggle}
          className={`text-white text-sm px-3 py-1 rounded ${
            price.is_enabled
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {price.is_enabled ? "Disable" : "Enable"}
        </button>

        <Dialog open={openEdit} onOpenChange={setOpenEdit}>
          <DialogTrigger className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-1 rounded">
            Edit
          </DialogTrigger>
          <DialogContent className="space-y-4 max-w-md w-full">
            <h2 className="text-xl font-bold">Edit Price</h2>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Amount</label>
              <input
                type="number"
                value={editedAmount}
                onChange={(e) => setEditedAmount(parseFloat(e.target.value))}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Type</label>
              <input
                type="text"
                value={editedType}
                onChange={(e) => setEditedType(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <button
              onClick={handleEditSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
              Save Changes
            </button>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}