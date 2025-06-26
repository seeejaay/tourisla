"use client";

import { useEffect, useState } from "react";
import { usePriceManager } from "@/hooks/usePriceManager";
import ViewPrice from "@/components/custom/price/ViewPrice";
import AddPrice from "@/components/custom/price/AddPrice";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

export default function PriceManagementPage() {
  const { prices, getAllPrices } = usePriceManager();
  const [openAdd, setOpenAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    getAllPrices();
  }, [getAllPrices]);

  const filteredPrices = prices.filter((p) => {
    const matchesSearch = p.type?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Enabled" && p.is_enabled) ||
      (statusFilter === "Disabled" && !p.is_enabled);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto mt-10 mb-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">
        Price Management
      </h1>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 mt-4">
        <input
          type="text"
          placeholder="Search by type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 border border-gray-300 px-4 py-2 rounded-lg"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-1/3 border border-gray-300 px-4 py-2 rounded-lg"
        >
          <option value="All">All Status</option>
          <option value="Enabled">Enabled</option>
          <option value="Disabled">Disabled</option>
        </select>
      </div>

      {/* Add Button */}
      <div className="mb-6 mt-4">
        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
          <DialogTrigger className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + Add New Price
          </DialogTrigger>
          <DialogContent className="max-w-md w-full">
            <AddPrice />
          </DialogContent>
        </Dialog>
      </div>

      {/* Results */}
      {filteredPrices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredPrices.map((p) => (
            <ViewPrice key={p.id} price={p} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No prices available.</p>
      )}
    </div>
  );
}
