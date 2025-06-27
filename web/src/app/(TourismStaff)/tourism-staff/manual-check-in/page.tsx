"use client";
import React, { useState } from "react";
import { useVisitorRegistration } from "@/hooks/useVisitorRegistration";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface VisitorData {
  id: number;
  unique_code: string;
  qr_code_url: string;
  registration_date: string;
  user_id: number | string;
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
    const result = await getVisitorResultByCode(uniqueCode);
    if (result && result.registration && result.registration.id) {
      setVisitorId(result.registration.id);
      setVisitorResult(result.registration); // store only the registration object
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
    }
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Manual Visitor Check-In</h1>
      <form onSubmit={handleFindVisitor} className="flex gap-2 mb-4">
        <Input
          placeholder="Enter unique code"
          value={uniqueCode}
          onChange={(e) => setUniqueCode(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          Find
        </Button>
      </form>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {visitorId && visitorResult && (
        <div className="mb-4">
          {/* Visitor Details */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-4">
              <img
                src={visitorResult.qr_code_url}
                alt="QR Code"
                className="w-20 h-20 rounded bg-white border"
              />
              <div>
                <div className="font-semibold text-blue-900 text-lg">
                  Code: {visitorResult.unique_code}
                </div>
                <div className="text-gray-700 text-sm">
                  Registration Date:{" "}
                  {visitorResult.registration_date
                    ? new Date(visitorResult.registration_date).toLocaleString()
                    : "N/A"}
                </div>
                <div className="text-gray-700 text-sm">
                  User ID: {visitorResult.user_id}
                </div>
                <div className="text-gray-700 text-sm">
                  Registration ID: {visitorResult.id}
                </div>
              </div>
            </div>
          </div>
          <Button onClick={handleCheckIn} disabled={loading}>
            Check In Visitor
          </Button>
        </div>
      )}
      {success && <div className="text-green-600">{success}</div>}
    </div>
  );
}
