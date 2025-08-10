"use client";
import React, { useState } from "react";
import { useVisitorRegistration } from "@/hooks/useVisitorRegistration";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface GroupMember {
  id: number;
  registration_id: number;
  name: string;
  sex: string;
  age: number;
  is_foreign: boolean;
  municipality: string;
  province: string;
  country: string;
}

interface VisitorData {
  id: number;
  unique_code: string;
  qr_code_url: string;
  registration_date: string;
  user_id: number | string;
  members?: GroupMember[];
}

export default function ManualCheckIn() {
  const [uniqueCode, setUniqueCode] = useState("");
  const [visitorId, setVisitorId] = useState<number | null>(null);
  const [visitorResult, setVisitorResult] = useState<VisitorData | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { getVisitorResultByCode, checkInVisitor, loading, error } =
    useVisitorRegistration();

  const handleFindVisitor = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setVisitorId(null);
    setVisitorResult(null);
    if (!uniqueCode) return;

    // Accept either code or name
    const input = /^[A-Z0-9]+$/i.test(uniqueCode.trim())
      ? { unique_code: uniqueCode.trim() }
      : { name: uniqueCode.trim() };

    const result = await getVisitorResultByCode(input);
    if (result && result.registration && result.registration.id) {
      setVisitorId(result.registration.id);
      setVisitorResult(result.registration); // registration now includes members
    } else {
      setVisitorId(null);
      setVisitorResult(null);
    }
  };

  const handleCheckIn = async () => {
    if (!visitorId) return;
    const checkedIn = await checkInVisitor(uniqueCode);
    if (checkedIn) {
      setSuccess("Visitor checked in successfully!");
      setVisitorId(null);
      setVisitorResult(null);
      setUniqueCode("");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#e6f7fa] to-white flex flex-col items-center py-10 px-2">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-[#e6f7fa] p-8">
        <h1 className="text-3xl font-extrabold mb-6 text-[#1c5461] text-center">
          Manual Visitor Check-In
        </h1>
        <form
          onSubmit={handleFindVisitor}
          className="flex flex-col sm:flex-row gap-3 mb-8 justify-center items-center"
        >
          <Input
            placeholder="Enter unique code"
            value={uniqueCode}
            onChange={(e) => setUniqueCode(e.target.value)}
            required
            className="border border-[#3e979f] px-4 py-2 rounded-lg w-64 focus:ring-2 focus:ring-[#3e979f] focus:outline-none"
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-[#3e979f] hover:bg-[#1c5461] text-white px-6 py-2 rounded-lg font-bold transition"
          >
            {loading ? "Searching..." : "Find"}
          </Button>
        </form>
        {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
        {success && (
          <div className="text-green-600 mb-4 text-center">{success}</div>
        )}
        {visitorId && visitorResult && (
          <div>
            <div className="mb-8 p-6 border border-[#e6f7fa] rounded-xl bg-[#f8fcfd] flex flex-col md:flex-row md:items-center gap-8 shadow-sm">
              <Image
                src={visitorResult.qr_code_url}
                alt="QR Code"
                width={160}
                height={160}
                className="w-40 h-40 border-4 border-blue-100 rounded-lg bg-white mx-auto md:mx-0"
              />
              <div className="flex-1">
                <div className="mb-2">
                  <span className="font-bold text-[#1c5461]">Unique Code:</span>{" "}
                  <span className="font-mono text-lg text-blue-700">
                    {visitorResult.unique_code}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="font-bold text-[#1c5461]">
                    Registration Date:
                  </span>{" "}
                  {visitorResult.registration_date
                    ? new Date(visitorResult.registration_date).toLocaleString()
                    : "N/A"}
                </div>
                <div className="mb-2">
                  <span className="font-bold text-[#1c5461]">User ID:</span>{" "}
                  {visitorResult.user_id ?? "N/A"}
                </div>
                <div className="mb-2">
                  <span className="font-bold text-[#1c5461]">
                    Registration ID:
                  </span>{" "}
                  {visitorResult.id}
                </div>
              </div>
            </div>
            {visitorResult.members && visitorResult.members.length > 0 && (
              <>
                <h2 className="font-bold text-xl mb-3 text-[#1c5461]">
                  Group Members
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full border text-center rounded-xl overflow-hidden">
                    <thead>
                      <tr className="bg-blue-100">
                        <th className="px-4 py-2 border">Name</th>
                        <th className="px-4 py-2 border">Sex</th>
                        <th className="px-4 py-2 border">Age</th>
                        <th className="px-4 py-2 border">Country</th>
                        <th className="px-4 py-2 border">Municipality</th>
                        <th className="px-4 py-2 border">Province</th>
                        <th className="px-4 py-2 border">Foreign?</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visitorResult.members.map((m) => (
                        <tr key={m.id} className="even:bg-blue-50">
                          <td className="px-4 py-2 border">{m.name}</td>
                          <td className="px-4 py-2 border">{m.sex}</td>
                          <td className="px-4 py-2 border">{m.age}</td>
                          <td className="px-4 py-2 border">{m.country}</td>
                          <td className="px-4 py-2 border">{m.municipality}</td>
                          <td className="px-4 py-2 border">{m.province}</td>
                          <td className="px-4 py-2 border">
                            {m.is_foreign ? (
                              <span className="text-red-600 font-semibold">
                                Yes
                              </span>
                            ) : (
                              <span className="text-green-700 font-semibold">
                                No
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            <div className="flex justify-center mt-6">
              <Button
                onClick={handleCheckIn}
                disabled={loading}
                className="rounded-lg bg-green-600 hover:bg-green-700 text-white px-6 py-2 font-bold transition"
              >
                Check In Visitor
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
