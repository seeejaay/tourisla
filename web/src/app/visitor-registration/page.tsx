"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { visitorRegistrationFields } from "@/app/static/visitor-registration/visitor";
import type { Visitor } from "@/app/static/visitor-registration/visitorSchema";
import { useVisitorRegistration } from "@/hooks/useVisitorRegistration";
import { Button } from "@/components/ui/button";
import Header from "@/components/custom/header";
import { useAuth } from "@/hooks/useAuth";

const emptyVisitor = () =>
  Object.fromEntries(
    visitorRegistrationFields.map((f) => [
      f.name,
      f.type === "checkbox" ? false : "",
    ])
  ) as Partial<Visitor>;

type FieldValue = string | boolean;

type CreateVisitorResponse = {
  registration: {
    unique_code: string;
  };
};

export default function WalkInRegister() {
  const [mainVisitor, setMainVisitor] = useState<Partial<Visitor>>(
    emptyVisitor()
  );
  const [companions, setCompanions] = useState<Partial<Visitor>[]>([]);
  const { createVisitor, loading, error } = useVisitorRegistration();
  const router = useRouter();
  const { loggedInUser } = useAuth();

  useEffect(() => {
    async function checkuser() {
      const user = await loggedInUser(router);
      if (!user) {
        router.push("/auth/login?redirect=/visitor-registration");
      }
    }
    checkuser();
  }, [loggedInUser, router]);

  const handleInputChange = (
    idx: number | null,
    field: keyof Visitor,
    value: FieldValue
  ) => {
    if (idx === null) {
      setMainVisitor((prev) => ({ ...prev, [field]: value }));
    } else {
      setCompanions((prev) =>
        prev.map((comp, i) => (i === idx ? { ...comp, [field]: value } : comp))
      );
    }
  };

  const handleAddCompanion = () => {
    setCompanions((prev) => [...prev, emptyVisitor()]);
  };

  const handleRemoveCompanion = (idx: number) => {
    setCompanions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const group = [mainVisitor, ...companions];
    const response = (await createVisitor(group)) as CreateVisitorResponse;
    router.push(
      `/visitor-registration/result?code=${encodeURIComponent(
        response.registration.unique_code
      )}`
    );
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-[#e6f7fa] via-[#f0f0f0] to-[#b6e0e4] flex flex-col items-center justify-start px-4 pt-24 pb-20">
        <main className="w-full max-w-2xl pt-16">
          <div className="p-8 shadow-lg border border-[#e6f7fa] bg-white rounded-2xl space-y-8">
            <div>
              <h1 className="text-3xl font-extrabold text-[#1c5461] text-center mb-2">
                Visitor Registration
              </h1>
              <p className="text-center text-[#51702c] mb-6">
                Register as a main visitor and add companions if needed.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h2 className="font-semibold text-lg mb-3 text-[#1c5461]">
                  Main Visitor
                </h2>
                {/* Name & Age */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-2 text-[#1c5461]">
                      Name
                    </label>
                    <input
                      type="text"
                      value={mainVisitor.name ?? ""}
                      onChange={(e) =>
                        handleInputChange(null, "name", e.target.value)
                      }
                      className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                      placeholder="Enter name"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-2 text-[#1c5461]">
                      Age
                    </label>
                    <input
                      type="number"
                      value={mainVisitor.age ?? ""}
                      onChange={(e) =>
                        handleInputChange(null, "age", e.target.value)
                      }
                      className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                      placeholder="Enter age"
                    />
                  </div>
                </div>
                {/* Sex & Foreign */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block font-semibold mb-2 text-[#1c5461]">
                      Sex
                    </label>
                    <select
                      value={mainVisitor.sex ?? ""}
                      onChange={(e) =>
                        handleInputChange(null, "sex", e.target.value)
                      }
                      className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                    >
                      <option value="">Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="flex  items-center gap-2 md:mt-0">
                    <input
                      type="checkbox"
                      checked={!!mainVisitor.is_foreign}
                      onChange={(e) =>
                        handleInputChange(null, "is_foreign", e.target.checked)
                      }
                      className="accent-[#3e979f]"
                    />
                    <label className="font-medium text-[#1c5461]">
                      Are you a foreign visitor?
                    </label>
                  </div>
                </div>
                {/* Municipality & Province */}
                {!mainVisitor.is_foreign && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block font-semibold mb-2 text-[#1c5461]">
                        Municipality
                      </label>
                      <input
                        type="text"
                        value={mainVisitor.municipality ?? ""}
                        onChange={(e) =>
                          handleInputChange(
                            null,
                            "municipality",
                            e.target.value
                          )
                        }
                        className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                        placeholder="Enter municipality"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-2 text-[#1c5461]">
                        Province
                      </label>
                      <input
                        type="text"
                        value={mainVisitor.province ?? ""}
                        onChange={(e) =>
                          handleInputChange(null, "province", e.target.value)
                        }
                        className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                        placeholder="Enter province"
                      />
                    </div>
                  </div>
                )}
                {/* Country */}
                <div>
                  <label className="block font-semibold mb-2 text-[#1c5461]">
                    Country
                  </label>
                  <select
                    value={mainVisitor.country ?? ""}
                    onChange={(e) =>
                      handleInputChange(null, "country", e.target.value)
                    }
                    className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                  >
                    <option value="">Select...</option>
                    <option value="Philippines">Philippines</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              {/* Companions */}
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
                      onClick={() => handleRemoveCompanion(idx)}
                      aria-label="Remove companion"
                    >
                      &times;
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-semibold mb-2 text-[#1c5461]">
                          Name
                        </label>
                        <input
                          type="text"
                          value={comp.name ?? ""}
                          onChange={(e) =>
                            handleInputChange(idx, "name", e.target.value)
                          }
                          className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                          placeholder="Enter name"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-2 text-[#1c5461]">
                          Age
                        </label>
                        <input
                          type="number"
                          value={comp.age ?? ""}
                          onChange={(e) =>
                            handleInputChange(idx, "age", e.target.value)
                          }
                          className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                          placeholder="Enter age"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-2 text-[#1c5461]">
                          Sex
                        </label>
                        <select
                          value={comp.sex ?? ""}
                          onChange={(e) =>
                            handleInputChange(idx, "sex", e.target.value)
                          }
                          className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                        >
                          <option value="">Select...</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2 mt-8 md:mt-0">
                        <input
                          type="checkbox"
                          checked={!!comp.is_foreign}
                          onChange={(e) =>
                            handleInputChange(
                              idx,
                              "is_foreign",
                              e.target.checked
                            )
                          }
                          className="accent-[#3e979f] scale-125"
                        />
                        <label className="font-semibold text-[#1c5461]">
                          Are you a foreign visitor?
                        </label>
                      </div>
                      {!comp.is_foreign && (
                        <>
                          <div>
                            <label className="block font-semibold mb-2 text-[#1c5461]">
                              Municipality
                            </label>
                            <input
                              type="text"
                              value={comp.municipality ?? ""}
                              onChange={(e) =>
                                handleInputChange(
                                  idx,
                                  "municipality",
                                  e.target.value
                                )
                              }
                              className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                              placeholder="Enter municipality"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold mb-2 text-[#1c5461]">
                              Province
                            </label>
                            <input
                              type="text"
                              value={comp.province ?? ""}
                              onChange={(e) =>
                                handleInputChange(
                                  idx,
                                  "province",
                                  e.target.value
                                )
                              }
                              className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                              placeholder="Enter province"
                            />
                          </div>
                        </>
                      )}
                      <div>
                        <label className="block font-semibold mb-2 text-[#1c5461]">
                          Country
                        </label>
                        <select
                          value={comp.country ?? ""}
                          onChange={(e) =>
                            handleInputChange(idx, "country", e.target.value)
                          }
                          className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                        >
                          <option value="">Select...</option>
                          <option value="Philippines">Philippines</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={handleAddCompanion}
                  className="mt-2 rounded-lg border-[#3e979f] text-[#1c5461] hover:bg-[#e6f7fa] hover:text-[#3e979f] transition"
                  variant="outline"
                >
                  Add Companion
                </Button>
              </div>
              {error && <div className="text-red-500">{error}</div>}
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#3e979f] text-white hover:bg-[#1c5461] transition"
              >
                {loading ? "Registering..." : "Register"}
              </Button>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}
