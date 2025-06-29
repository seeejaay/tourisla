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
    <Card className="p-6 space-y-4 border border-[#e6f7fa] rounded-2xl shadow-md bg-white flex flex-col items-center">
      <h3 className="text-3xl font-extrabold text-[#1c5461]">
        ₱{price.amount}
      </h3>
      <p className="text-base text-[#51702c] font-semibold">
        Type: <span className="font-normal">{price.type || "—"}</span>
      </p>
      <p className="text-base">
        Status:{" "}
        <span
          className={
            price.is_enabled
              ? "text-green-600 font-semibold"
              : "text-red-500 font-semibold"
          }
        >
          {price.is_enabled ? "Enabled" : "Disabled"}
        </span>
      </p>

      <div className="flex gap-2 mt-2">
        <button
          onClick={handleToggle}
          className={`text-white text-sm px-4 py-2 rounded-lg font-semibold transition-colors ${
            price.is_enabled
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {price.is_enabled ? "Disable" : "Enable"}
        </button>

        <Dialog open={openEdit} onOpenChange={setOpenEdit}>
          <DialogTrigger asChild>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-4 py-2 rounded-lg font-semibold transition-colors">
              Edit
            </button>
          </DialogTrigger>
          <DialogContent className="space-y-4 max-w-md w-full">
            <h2 className="text-xl font-bold text-[#1c5461]">Edit Price</h2>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#51702c]">
                Amount
              </label>
              <input
                type="number"
                value={editedAmount}
                min={0}
                step="0.01"
                onChange={(e) => setEditedAmount(parseFloat(e.target.value))}
                className="w-full border border-[#e6f7fa] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e979f]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#51702c]">
                Type
              </label>
              <input
                type="text"
                value={editedType}
                onChange={(e) => setEditedType(e.target.value)}
                className="w-full border border-[#e6f7fa] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e979f]"
              />
            </div>

            <button
              onClick={handleEditSubmit}
              className="bg-[#3e979f] hover:bg-[#1c5461] text-white px-4 py-2 rounded-lg w-full font-semibold transition-colors"
            >
              Save Changes
            </button>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}
