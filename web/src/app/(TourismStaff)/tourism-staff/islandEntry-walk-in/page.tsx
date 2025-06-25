"use client";
import { useState } from "react";
import { islandEntryFields } from "@/app/static/islandEntry/islandEntryFields";
import Header from "@/components/custom/header";
import { registerIslandWalkIn } from "@/lib/api/islandEntry";
import type { AxiosError } from "axios";
import { getTourismFee } from "@/lib/api/islandEntry";
import { useEffect } from "react";

export interface GroupMember {
  name: string;
  sex: string;
  age: number;
  is_foreign: boolean;
  municipality: string;
  province: string;
  country: string;
}

interface IslandEntryLog {
  id: number;
  scanned_by_user_id: number;
  visit_date: string;
  registration_id: number;
}

interface WalkInResult {
  registration: {
    unique_code: string;
    qr_code_url: string;
  };
  members: GroupMember[];
  logs: IslandEntryLog[];
  total_fee: number;
  message: string;
}

export default function WalkInIslandEntryPage() {
  const [main, setMain] = useState<GroupMember>({
    name: "",
    sex: "",
    age: 0,
    is_foreign: false,
    municipality: "",
    province: "",
    country: "",
  });
  const [companions, setCompanions] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WalkInResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fee, setFee] = useState<number>(0);

    useEffect(() => {
        getTourismFee().then((data) => {
        setFee(Number(data.amount));
    });
    }, []);

    const totalMembers = 1 + companions.length;
    const totalFee = fee * totalMembers;

  const handleMainChange = (field: keyof GroupMember, value: string | boolean | number) => {
    setMain((prev) => ({ ...prev, [field]: value }));
  };

  const handleCompanionChange = (idx: number, field: keyof GroupMember, value: string | boolean | number) => {
    setCompanions((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, [field]: value } : c))
    );
  };

  const addCompanion = () => {
    setCompanions((prev) => [
      ...prev,
      { name: "", sex: "", age: 0, is_foreign: false, municipality: "", province: "", country: "" },
    ]);
  };

  const removeCompanion = (idx: number) => {
    setCompanions((prev) => prev.filter((_, i) => i !== idx));
  };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  try {
    const groupMembers = [main, ...companions];
    const res = await registerIslandWalkIn({ groupMembers });
    setResult(res.data);
  } catch (err) {
    const axiosErr = err as AxiosError<{ error: string }>;
    setError(axiosErr.response?.data?.error || "Registration failed.");
  } finally {
    setLoading(false);
  }
};

  if (result) {
    return (
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-2">Walk-in Registration Successful!</h2>
        <p>Your Unique Code: <span className="font-mono">{result.registration.unique_code}</span></p>
        <img src={result.registration.qr_code_url} alt="QR Code" className="my-4 w-40 h-40" />
        <p className="text-green-700 font-semibold">Show this QR code at the entry point.</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-3xl font-extrabold mb-6 text-blue-700 text-center">
          Walk-In Island Entry Registration
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {islandEntryFields.map((field) => {
            if (field.showIf && !field.showIf(main)) return null;
            if (field.type === "select") {
              return (
                <div key={field.name}>
                  <label className="block mb-1 font-semibold text-gray-700">{field.label}</label>
                  <select
                    value={main[field.name]}
                    onChange={e => handleMainChange(field.name, e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select</option>
                    {field.options.map((opt: string) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              );
            }
            if (field.type === "checkbox") {
              return (
                <div key={field.name} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={main[field.name]}
                    onChange={e => handleMainChange(field.name, e.target.checked)}
                    className="mr-2 accent-blue-600"
                  />
                  <label className="font-semibold text-gray-700">{field.label}</label>
                </div>
              );
            }
            return (
              <div key={field.name}>
                <label className="block mb-1 font-semibold text-gray-700">{field.label}</label>
                <input
                  type={field.type}
                  value={main[field.name]}
                  onChange={e => handleMainChange(field.name, e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            );
          })}

          <div>
            <h3 className="font-bold mb-2 text-gray-800">Companions</h3>
            {companions.map((comp, idx) => (
              <div key={idx} className="border border-gray-200 p-3 mb-3 rounded-lg bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-blue-600">Companion {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeCompanion(idx)}
                    className="text-red-500 hover:text-red-700 text-xs"
                  >
                    Remove
                  </button>
                </div>
                {islandEntryFields.map((field) => {
                  if (field.showIf && !field.showIf(comp)) return null;
                  if (field.type === "select") {
                    return (
                      <div key={field.name} className="mb-1">
                        <label className="block text-gray-600">{field.label}</label>
                        <select
                          value={comp[field.name]}
                          onChange={e => handleCompanionChange(idx, field.name, e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-2 py-1"
                        >
                          <option value="">Select</option>
                          {field.options.map((opt: string) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    );
                  }
                  if (field.type === "checkbox") {
                    return (
                      <div key={field.name} className="mb-1 flex items-center">
                        <input
                          type="checkbox"
                          checked={comp[field.name]}
                          onChange={e => handleCompanionChange(idx, field.name, e.target.checked)}
                          className="mr-2 accent-blue-600"
                        />
                        <label className="text-gray-600">{field.label}</label>
                      </div>
                    );
                  }
                  return (
                    <div key={field.name} className="mb-1">
                      <label className="block text-gray-600">{field.label}</label>
                      <input
                        type={field.type}
                        value={comp[field.name]}
                        onChange={e => handleCompanionChange(idx, field.name, e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-2 py-1"
                      />
                    </div>
                  );
                })}
              </div>
            ))}
            <button
              type="button"
              onClick={addCompanion}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg mt-2"
            >
              Add Companion
            </button>
          </div>

          {error && <div className="text-red-600">{error}</div>}

            <div className="text-lg font-bold text-blue-700 text-center mb-2">
                Amount to be paid: <span className="text-green-700">₱{totalFee.toLocaleString()}</span>
            </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg w-full font-bold text-lg shadow transition"
          >
            {loading ? "Registering..." : "Submit"}
          </button>
        </form>
      </div>
    </>
  );
}