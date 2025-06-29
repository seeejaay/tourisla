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
    <main className="flex flex-col items-center min-h-screen w-full bg-gradient-to-br from-[#e6f7fa] via-white to-[#b6e0e4] px-2 py-8">
      <div className="w-full max-w-6xl flex flex-col items-center gap-6">
        <h1 className="text-4xl font-extrabold text-center text-[#1c5461] tracking-tight mt-4">
          Price Management
        </h1>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full bg-white rounded-xl shadow border border-[#e6f7fa] px-6 py-4">
          <input
            type="text"
            placeholder="Search by type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e979f]"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-1/3 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e979f]"
          >
            <option value="All">All Status</option>
            <option value="Enabled">Enabled</option>
            <option value="Disabled">Disabled</option>
          </select>
        </div>

        {/* Add Button */}
        <div className="w-full flex justify-end">
          <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            <DialogTrigger asChild>
              <button className="bg-[#3e979f] text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-[#1c5461] transition-colors">
                + Add New Price
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-md w-full">
              <AddPrice />
            </DialogContent>
          </Dialog>
        </div>

        {/* Results */}
        {filteredPrices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
            {filteredPrices.map((p) => (
              <ViewPrice key={p.id} price={p} />
            ))}
          </div>
        ) : (
          <div className="w-full flex justify-center items-center py-12">
            <p className="text-center text-gray-500 text-lg">
              No prices available.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
