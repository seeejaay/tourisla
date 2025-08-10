"use client";
import { useState, useEffect } from "react";
import {
  getIslandEntryMembers,
  manualIslandEntryCheckIn,
  markIslandEntryPaid,
} from "@/lib/api/islandEntry";
import type { AxiosError } from "axios";

interface Registration {
  id: number;
  unique_code: string;
  qr_code_url: string;
  registration_date: string;
  payment_method: string;
  status: string;
  total_fee: string;
  user_id: number;
}

interface Member {
  id: number;
  registration_id: number;
  name: string;
  age: number;
  sex: string;
  municipality: string;
  province: string;
  country: string;
  is_foreign: boolean;
}

export default function IslandEntryLookupPage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<{
    registration: Registration;
    members: Member[];
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      // Helper: check if input is likely a unique code (alphanumeric, 5-10 chars)
      const isUniqueCode = /^[A-Z0-9]{5,10}$/i.test(code.trim());
      const params = isUniqueCode
        ? { unique_code: code.trim() }
        : { name: code.trim() };
      const res = await getIslandEntryMembers(params);
      setResult(res.data);
    } catch (err) {
      const axiosErr = err as AxiosError<{ error: string }>;
      setError(axiosErr.response?.data?.error || "Lookup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-[#e6f7fa] to-white flex flex-col items-center py-10 px-2">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-[#e6f7fa] p-8">
          <h1 className="text-3xl font-extrabold mb-6 text-[#1c5461] text-center">
            Island Entry Registration Lookup
          </h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 mb-8 justify-center items-center"
          >
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter Unique Code"
              className="border border-[#3e979f] px-4 py-2 rounded-lg w-64 focus:ring-2 focus:ring-[#3e979f] focus:outline-none"
              required
            />
            <button
              type="submit"
              className="bg-[#3e979f] hover:bg-[#1c5461] text-white px-6 py-2 rounded-lg font-bold transition"
              disabled={loading}
            >
              {loading ? "Searching..." : "Lookup"}
            </button>
            {result && (
              <>
                <button
                  type="button"
                  className={`bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold transition ${
                    result.registration.status !== "PAID"
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={result.registration.status !== "PAID" || loading}
                  onClick={async () => {
                    setLoading(true);
                    setError(null);
                    setSuccess(null);
                    try {
                      await manualIslandEntryCheckIn(code.trim());
                      setSuccess("Check-in successful!");
                      setResult(null);
                      setCode("");
                    } catch (err) {
                      console.error(err);
                      setError("Check-in failed.");
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  Check-in
                </button>
                {result.registration.status !== "PAID" && (
                  <button
                    type="button"
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-bold transition"
                    disabled={loading}
                    onClick={async () => {
                      setLoading(true);
                      setError(null);
                      setSuccess(null);
                      try {
                        await markIslandEntryPaid(code);
                        const res = await getIslandEntryMembers({
                          unique_code: code,
                        });
                        setResult(res.data);
                        setSuccess("Payment marked as received!");
                      } catch (err) {
                        console.error(err);
                        setError("Failed to mark as paid.");
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    Mark as Paid
                  </button>
                )}
              </>
            )}
          </form>
          {error && (
            <div className="text-red-600 mb-4 text-center">{error}</div>
          )}
          {success && (
            <div className="text-green-600 mb-4 text-center">{success}</div>
          )}
          {result && (
            <div>
              <div className="mb-8 p-6 border border-[#e6f7fa] rounded-xl bg-[#f8fcfd] flex flex-col md:flex-row md:items-center gap-8 shadow-sm">
                <img
                  src={result.registration.qr_code_url}
                  alt="QR Code"
                  className="w-40 h-40 border-4 border-blue-100 rounded-lg bg-white mx-auto md:mx-0"
                />
                <div className="flex-1">
                  <div className="mb-2">
                    <span className="font-bold text-[#1c5461]">
                      Unique Code:
                    </span>{" "}
                    <span className="font-mono text-lg text-blue-700">
                      {result.registration.unique_code}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="font-bold text-[#1c5461]">
                      Registration Date:
                    </span>{" "}
                    {new Date(
                      result.registration.registration_date
                    ).toLocaleString()}
                  </div>
                  <div className="mb-2">
                    <span className="font-bold text-[#1c5461]">
                      Payment Method:
                    </span>{" "}
                    {result.registration.payment_method}
                  </div>
                  <div className="mb-2">
                    <span className="font-bold text-[#1c5461]">Status:</span>{" "}
                    <span
                      className={
                        result.registration.status === "PAID"
                          ? "text-green-700 font-bold"
                          : "text-yellow-700 font-bold"
                      }
                    >
                      {result.registration.status}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="font-bold text-[#1c5461]">Total Fee:</span>{" "}
                    <span className="text-green-700 font-bold">
                      ₱{Number(result.registration.total_fee).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <h2 className="font-bold text-xl mb-3 text-[#1c5461]">
                Group Members
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border text-center rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-blue-100">
                      <th className="px-4 py-2 border">Name</th>
                      <th className="px-4 py-2 border">Age</th>
                      <th className="px-4 py-2 border">Sex</th>
                      <th className="px-4 py-2 border">Municipality</th>
                      <th className="px-4 py-2 border">Province</th>
                      <th className="px-4 py-2 border">Country</th>
                      <th className="px-4 py-2 border">Foreign?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.members.map((m) => (
                      <tr key={m.id} className="even:bg-blue-50">
                        <td className="px-4 py-2 border">{m.name}</td>
                        <td className="px-4 py-2 border">{m.age}</td>
                        <td className="px-4 py-2 border">{m.sex}</td>
                        <td className="px-4 py-2 border">{m.municipality}</td>
                        <td className="px-4 py-2 border">{m.province}</td>
                        <td className="px-4 py-2 border">{m.country}</td>
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
            </div>
          )}
        </div>
      </main>
    </>
  );
}
