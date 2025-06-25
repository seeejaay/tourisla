"use client";
import { useState } from "react";
import { getIslandEntryMembers } from "@/lib/api/islandEntry";
import Header from "@/components/custom/header";
import type { AxiosError } from "axios";
import { manualIslandEntryCheckIn, markIslandEntryPaid } from "@/lib/api/islandEntry";
import { useEffect } from "react";



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
    }, 3000); // 3 seconds
    return () => clearTimeout(timer);
  }
}, [success, error]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await getIslandEntryMembers(code.trim());
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
        <Header />
        <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">
            Island Entry Registration Lookup
        </h1>
        <form onSubmit={handleSubmit} className="flex gap-2 mb-8 justify-center">
            <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="Enter Unique Code"
                className="border px-3 py-2 rounded w-60"
                required
            />
            <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded font-bold"
                disabled={loading}
            >
                {loading ? "Searching..." : "Lookup"}
            </button>
            {result && (
                <>
                <button
                    type="button"
                    className="bg-green-600 text-white px-6 py-2 rounded font-bold"
                    disabled={result.registration.status !== "PAID"}
                    onClick={async () => {
                        setLoading(true);
                        setError(null);
                        setSuccess(null);
                        try {
                            await manualIslandEntryCheckIn(code.trim());
                            setSuccess("Check-in successful!");
                        } catch (err) {
                            setError("Check-in failed.");
                        } finally {
                            setLoading(false);
                        }
                    }}
                >
                    Check-in
                </button>
                {result.registration.payment_status !== "PAID" && (
                    <button
                    type="button"
                    className="bg-yellow-600 text-white px-6 py-2 rounded font-bold"
                    onClick={async () => {
                    setLoading(true);
                    setError(null);
                    setSuccess(null);
                    try {
                        await markIslandEntryPaid(code.trim());
                        const res = await getIslandEntryMembers(code.trim());
                        setResult(res.data);
                        setSuccess("Payment marked as received!");
                        } catch (err) {
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
        {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
        {success && <div className="text-green-600 mb-4 text-center">{success}</div>}
        {result && (
            <div>
            <div className="mb-8 p-6 border rounded bg-gray-50 flex flex-col md:flex-row md:items-center gap-8">
                <img
                src={result.registration.qr_code_url}
                alt="QR Code"
                className="w-40 h-40 border rounded bg-white mx-auto md:mx-0"
                />
                <div className="flex-1">
                <div className="mb-2">
                    <span className="font-bold">Unique Code:</span>{" "}
                    <span className="font-mono text-lg">{result.registration.unique_code}</span>
                </div>
                <div className="mb-2">
                    <span className="font-bold">Registration Date:</span>{" "}
                    {new Date(result.registration.registration_date).toLocaleString()}
                </div>
                <div className="mb-2">
                    <span className="font-bold">Payment Method:</span>{" "}
                    {result.registration.payment_method}
                </div>
                <div className="mb-2">
                    <span className="font-bold">Status:</span>{" "}
                    {result.registration.status}
                </div>
                <div className="mb-2">
                    <span className="font-bold">Total Fee:</span>{" "}
                    ₱{Number(result.registration.total_fee).toLocaleString()}
                </div>
                {/* <div>
                    <span className="font-bold">User ID:</span>{" "}
                    {result.registration.user_id}
                </div> */}
                </div>
            </div>
            <h2 className="font-bold text-xl mb-3">Group Members</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full border text-center">
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
                    <tr key={m.id}>
                        <td className="px-4 py-2 border">{m.name}</td>
                        <td className="px-4 py-2 border">{m.age}</td>
                        <td className="px-4 py-2 border">{m.sex}</td>
                        <td className="px-4 py-2 border">{m.municipality}</td>
                        <td className="px-4 py-2 border">{m.province}</td>
                        <td className="px-4 py-2 border">{m.country}</td>
                        <td className="px-4 py-2 border">{m.is_foreign ? "Yes" : "No"}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>
        )}
        </div>
    </>
    );
}