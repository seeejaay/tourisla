"use client";
import React, { useState } from "react";
import { visitorRegistrationFields } from "@/app/static/visitor-registration/visitor";
import type { Visitor } from "@/app/static/visitor-registration/visitorSchema";
import { useVisitorRegistration } from "@/hooks/useVisitorRegistration";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const emptyVisitor = () =>
  Object.fromEntries(
    visitorRegistrationFields.map((f) => [
      f.name,
      f.type === "checkbox" ? false : "",
    ])
  ) as Partial<Visitor>;

type FieldValue = string | boolean;

export default function WalkInStaffRegister() {
  const router = useRouter();
  const [mainVisitor, setMainVisitor] = useState<Partial<Visitor>>(
    emptyVisitor()
  );
  const [companions, setCompanions] = useState<Partial<Visitor>[]>([]);
  const [result, setResult] = useState<{
    unique_code: string;
    qr_code_url: string;
  } | null>(null);
  const { registerWalkInVisitor, loading, error } = useVisitorRegistration();

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
    const response = await registerWalkInVisitor(group);
    if (
      response &&
      response.registration &&
      response.registration.unique_code
    ) {
      router.push(
        `/tourism-staff/walk-in-registration/result?code=${encodeURIComponent(
          response.registration.unique_code
        )}`
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e6f7fa] via-[#f0f0f0] to-[#b6e0e4] flex flex-col items-center justify-start px-4 pt-24 pb-20">
      <main className="w-full max-w-2xl pt-16">
        <div className="p-8 shadow-lg border border-[#e6f7fa] bg-white rounded-2xl space-y-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1c5461] text-center mb-2">
              Walk-In Visitor Registration (Staff)
            </h1>
            <p className="text-center text-[#51702c] mb-6">
              Register a walk-in visitor and add companions if needed.
            </p>
          </div>
          {result ? (
            <div className="flex flex-col items-center gap-4 mt-8">
              <h2 className="text-xl font-semibold">Registration Complete!</h2>
              <p>
                Unique code:{" "}
                <span className="font-mono">{result.unique_code}</span>
              </p>
              <p>
                Show this QR code to the tourist so they can take a picture:
              </p>
              <img
                src={result.qr_code_url}
                alt="QR Code"
                className="w-44 h-44"
              />
              <Button
                onClick={() => {
                  setResult(null);
                  setMainVisitor(emptyVisitor());
                  setCompanions([]);
                }}
              >
                Register Another Visitor
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h2 className="font-semibold text-lg mb-3 text-[#1c5461]">
                  Main Visitor
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {visitorRegistrationFields
                    .filter((field) => {
                      if (
                        (field.name === "municipality" ||
                          field.name === "province") &&
                        !!mainVisitor["is_foreign"]
                      ) {
                        return false;
                      }
                      return true;
                    })
                    .map((field) => (
                      <div key={field.name}>
                        <label className="block font-semibold mb-2 text-[#1c5461]">
                          {field.label}
                        </label>
                        {field.type === "select" ? (
                          <select
                            value={
                              typeof mainVisitor[
                                field.name as keyof Visitor
                              ] === "boolean"
                                ? ""
                                : (mainVisitor[field.name as keyof Visitor] as
                                    | string
                                    | number
                                    | undefined) ?? ""
                            }
                            onChange={(e) =>
                              handleInputChange(
                                null,
                                field.name as keyof Visitor,
                                e.target.value
                              )
                            }
                            className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                          >
                            <option value="">Select...</option>
                            {field.options?.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        ) : field.type === "checkbox" ? (
                          <div className="flex items-center gap-2 mt-2">
                            <input
                              type="checkbox"
                              checked={
                                !!mainVisitor[field.name as keyof Visitor]
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  null,
                                  field.name as keyof Visitor,
                                  e.target.checked
                                )
                              }
                              className="accent-[#3e979f] scale-125"
                            />
                            <label className="font-medium text-[#1c5461]">
                              {field.label}
                            </label>
                          </div>
                        ) : (
                          <input
                            type={field.type}
                            value={
                              typeof mainVisitor[
                                field.name as keyof Visitor
                              ] === "boolean"
                                ? ""
                                : (mainVisitor[field.name as keyof Visitor] as
                                    | string
                                    | number
                                    | undefined) ?? ""
                            }
                            onChange={(e) =>
                              handleInputChange(
                                null,
                                field.name as keyof Visitor,
                                e.target.value
                              )
                            }
                            className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                          />
                        )}
                      </div>
                    ))}
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
                      onClick={() => handleRemoveCompanion(idx)}
                      aria-label="Remove companion"
                    >
                      &times;
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {visitorRegistrationFields
                        .filter((field) => {
                          if (
                            (field.name === "municipality" ||
                              field.name === "province") &&
                            !!comp["is_foreign"]
                          ) {
                            return false;
                          }
                          return true;
                        })
                        .map((field) => (
                          <div key={field.name}>
                            <label className="block font-semibold mb-2 text-[#1c5461]">
                              {field.label}
                            </label>
                            {field.type === "select" ? (
                              <select
                                value={
                                  typeof comp[field.name as keyof Visitor] ===
                                  "boolean"
                                    ? ""
                                    : (comp[field.name as keyof Visitor] as
                                        | string
                                        | number
                                        | undefined) ?? ""
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    idx,
                                    field.name as keyof Visitor,
                                    e.target.value
                                  )
                                }
                                className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                              >
                                <option value="">Select...</option>
                                {field.options?.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            ) : field.type === "checkbox" ? (
                              <div className="flex items-center gap-2 mt-2">
                                <input
                                  type="checkbox"
                                  checked={!!comp[field.name as keyof Visitor]}
                                  onChange={(e) =>
                                    handleInputChange(
                                      idx,
                                      field.name as keyof Visitor,
                                      e.target.checked
                                    )
                                  }
                                  className="accent-[#3e979f] scale-125"
                                />
                                <label className="font-medium text-[#1c5461]">
                                  {field.label}
                                </label>
                              </div>
                            ) : (
                              <input
                                type={field.type}
                                value={
                                  typeof comp[field.name as keyof Visitor] ===
                                  "boolean"
                                    ? ""
                                    : (comp[field.name as keyof Visitor] as
                                        | string
                                        | number
                                        | undefined) ?? ""
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    idx,
                                    field.name as keyof Visitor,
                                    e.target.value
                                  )
                                }
                                className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                              />
                            )}
                          </div>
                        ))}
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
          )}
        </div>
      </main>
    </div>
  );
}
