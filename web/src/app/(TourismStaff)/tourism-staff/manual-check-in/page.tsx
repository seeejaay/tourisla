"use client";
import React, { useState } from "react";
import { useVisitorRegistration } from "@/hooks/useVisitorRegistration";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ManualCheckIn() {
  const [uniqueCode, setUniqueCode] = useState("");
  const [visitorId, setVisitorId] = useState<number | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { getVisitorResultByCode, checkInVisitor, loading, error } =
    useVisitorRegistration();

  const handleFindVisitor = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setVisitorId(null);
    if (!uniqueCode) return;
    const result = await getVisitorResultByCode(uniqueCode);
    if (result && result.registration && result.registration.id) {
      setVisitorId(result.registration.id);
    } else {
      setVisitorId(null);
    }
  };

  const handleCheckIn = async () => {
    if (!visitorId) return;
    const checkedIn = await checkInVisitor(visitorId);
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
      {visitorId && (
        <div className="mb-4">
          <Button onClick={handleCheckIn} disabled={loading}>
            Check In Visitor
          </Button>
        </div>
      )}
      {success && <div className="text-green-600">{success}</div>}
    </div>
  );
}
