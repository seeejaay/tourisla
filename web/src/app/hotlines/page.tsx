"use client";
import { useHotlineManager } from "@/hooks/useHotlineManager";
import { useState } from "react";
import Header from "@/components/custom/header";
import Footer from "@/components/custom/footer";
export default function HotlinesPage() {
  const { hotlines, loading, error } = useHotlineManager();
  const [search, setSearch] = useState("");

  const filteredHotlines = hotlines.filter(
    (h) =>
      h.type.toLowerCase().includes(search.toLowerCase()) ||
      h.municipality.toLowerCase().includes(search.toLowerCase()) ||
      h.contact_number.toLowerCase().includes(search.toLowerCase()) ||
      (h.address && h.address.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b pt-28 from-[#e6f7fa] to-white flex flex-col items-center py-10 px-2">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-[#e6f7fa] p-8">
          <h1 className="text-3xl font-extrabold mb-6 text-[#1c5461] text-center">
            Emergency Hotlines
          </h1>
          <input
            type="text"
            placeholder="Search by type, municipality, number, or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-6 px-4 py-2 border border-[#3e979f] rounded-lg focus:ring-2 focus:ring-[#3e979f] focus:outline-none"
          />
          {loading && (
            <div className="text-center text-blue-600 mb-4">
              Loading hotlines...
            </div>
          )}
          {error && (
            <div className="text-center text-red-600 mb-4">{error}</div>
          )}
          <div className="space-y-4">
            {filteredHotlines.length === 0 && !loading ? (
              <div className="text-center text-gray-500">
                No hotlines found.
              </div>
            ) : (
              filteredHotlines.map((hotline) => (
                <div
                  key={hotline.id}
                  className="p-4 rounded-xl border border-[#e6f7fa] bg-[#f8fcfd] shadow flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                >
                  <div>
                    <div className="font-bold text-[#1c5461] text-lg uppercase tracking-wide">
                      {hotline.type.replace(/_/g, " ")}
                    </div>
                    <div className="text-gray-700 text-sm">
                      {hotline.municipality}
                    </div>
                    {hotline.address && (
                      <div className="text-gray-500 text-xs">
                        {hotline.address}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-blue-700 text-lg">
                      {hotline.contact_number}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
