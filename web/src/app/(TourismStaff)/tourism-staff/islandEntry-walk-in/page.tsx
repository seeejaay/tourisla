"use client";
import { useState, useEffect } from "react";
import { islandEntryFields } from "@/app/static/islandEntry/islandEntryFields";
import { registerIslandWalkIn, getTourismFee } from "@/lib/api/islandEntry";
import type { AxiosError } from "axios";

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

  const handleMainChange = (
    field: keyof GroupMember,
    value: string | boolean | number
  ) => {
    setMain((prev) => ({ ...prev, [field]: value }));
  };

  const handleCompanionChange = (
    idx: number,
    field: keyof GroupMember,
    value: string | boolean | number
  ) => {
    setCompanions((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, [field]: value } : c))
    );
  };

  const addCompanion = () => {
    setCompanions((prev) => [
      ...prev,
      {
        name: "",
        sex: "",
        age: 0,
        is_foreign: false,
        municipality: "",
        province: "",
        country: "",
      },
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#e6f7fa] to-white px-2">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-[#e6f7fa] p-8 mt-16 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-[#1c5461] mb-2 text-center">
            Walk-in Registration Successful!
          </h2>
          <p className="mb-2 text-gray-700 text-center">
            Your Unique Code:
            <span className="font-mono text-blue-700 ml-2">
              {result.registration.unique_code}
            </span>
          </p>
          <img
            src={result.registration.qr_code_url}
            alt="QR Code"
            className="my-4 w-44 h-44 border-4 border-blue-100 rounded-lg shadow"
          />
          <p className="text-green-700 font-semibold text-center">
            Show this QR code at the entry point.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen flex flex-col items-center bg-gradient-to-b from-[#e6f7fa] to-white px-2">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg border border-[#e6f7fa] p-8 mt-16">
          <h1 className="text-3xl font-extrabold mb-6 text-[#1c5461] text-center">
            Walk-In Island Entry Registration
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="font-semibold text-lg mb-3 text-[#1c5461]">
                Main Visitor
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {islandEntryFields.map((field) => {
                  if (field.showIf && !field.showIf(main)) return null;
                  if (field.type === "select") {
                    return (
                      <div key={field.name}>
                        <label className="block font-semibold mb-2 text-[#1c5461]">
                          {field.label}
                        </label>
                        <select
                          value={main[field.name]}
                          onChange={(e) =>
                            handleMainChange(field.name, e.target.value)
                          }
                          className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                        >
                          <option value="">Select...</option>
                          {field.options.map((opt: string) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }
                  if (field.type === "checkbox") {
                    return (
                      <div key={field.name} className="flex items-center mt-2">
                        <input
                          type="checkbox"
                          checked={main[field.name]}
                          onChange={(e) =>
                            handleMainChange(field.name, e.target.checked)
                          }
                          className="accent-[#3e979f] scale-125"
                        />
                        <label className="font-medium text-[#1c5461] ml-2">
                          {field.label}
                        </label>
                      </div>
                    );
                  }
                  return (
                    <div key={field.name}>
                      <label className="block font-semibold mb-2 text-[#1c5461]">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        value={main[field.name]}
                        onChange={(e) =>
                          handleMainChange(field.name, e.target.value)
                        }
                        className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <h2 className="font-semibold text-lg mb-3 text-[#1c5461]">
                Companions
              </h2>
              {companions.map((comp, idx) => (
                <div
                  key={idx}
                  className="relative mb-8 rounded-xl bg-white border border-[#e6f7fa] shadow-sm p-6"
                >
                  <button
                    type="button"
                    className="absolute top-4 right-4 text-red-500 text-2xl font-bold"
                    onClick={() => removeCompanion(idx)}
                    aria-label="Remove companion"
                  >
                    &times;
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {islandEntryFields.map((field) => {
                      if (field.showIf && !field.showIf(comp)) return null;
                      if (field.type === "select") {
                        return (
                          <div key={field.name}>
                            <label className="block font-semibold mb-2 text-[#1c5461]">
                              {field.label}
                            </label>
                            <select
                              value={comp[field.name]}
                              onChange={(e) =>
                                handleCompanionChange(
                                  idx,
                                  field.name,
                                  e.target.value
                                )
                              }
                              className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                            >
                              <option value="">Select...</option>
                              {field.options.map((opt: string) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          </div>
                        );
                      }
                      if (field.type === "checkbox") {
                        return (
                          <div
                            key={field.name}
                            className="flex items-center mt-2"
                          >
                            <input
                              type="checkbox"
                              checked={comp[field.name]}
                              onChange={(e) =>
                                handleCompanionChange(
                                  idx,
                                  field.name,
                                  e.target.checked
                                )
                              }
                              className="accent-[#3e979f] scale-125"
                            />
                            <label className="font-medium text-[#1c5461] ml-2">
                              {field.label}
                            </label>
                          </div>
                        );
                      }
                      return (
                        <div key={field.name}>
                          <label className="block font-semibold mb-2 text-[#1c5461]">
                            {field.label}
                          </label>
                          <input
                            type={field.type}
                            value={comp[field.name]}
                            onChange={(e) =>
                              handleCompanionChange(
                                idx,
                                field.name,
                                e.target.value
                              )
                            }
                            className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addCompanion}
                className="mt-2 rounded-lg border-[#3e979f] text-[#1c5461] hover:bg-[#e6f7fa] hover:text-[#3e979f] transition px-4 py-2 border bg-white font-semibold"
              >
                Add Companion
              </button>
            </div>
            {error && <div className="text-red-600 text-center">{error}</div>}
            <div className="text-lg font-bold text-blue-700 text-center mb-2">
              Amount to be paid:{" "}
              <span className="text-green-700">
                ₱{totalFee.toLocaleString()}
              </span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#3e979f] text-white hover:bg-[#1c5461] transition px-6 py-3 font-bold text-lg shadow"
            >
              {loading ? "Registering..." : "Submit"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
