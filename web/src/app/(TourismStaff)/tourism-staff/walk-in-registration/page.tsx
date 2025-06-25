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
    <>
      <div className="max-w-xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">
          Walk-In Visitor Registration (Staff)
        </h1>
        {result ? (
          <div className="flex flex-col items-center gap-4 mt-8">
            <h2 className="text-xl font-semibold">Registration Complete!</h2>
            <p>
              Unique code:{" "}
              <span className="font-mono">{result.unique_code}</span>
            </p>
            <p>Show this QR code to the tourist so they can take a picture:</p>
            <img src={result.qr_code_url} alt="QR Code" className="w-44 h-44" />
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="font-semibold mb-2">Main Visitor</h2>
              <div className="grid grid-cols-1 gap-3">
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
                      <label className="block font-medium mb-1">
                        {field.label}
                      </label>
                      {field.type === "select" ? (
                        <select
                          value={
                            typeof mainVisitor[field.name as keyof Visitor] ===
                            "boolean"
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
                          className="w-full border rounded px-2 py-1"
                        >
                          <option value="">Select...</option>
                          {field.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : field.type === "checkbox" ? (
                        <input
                          type="checkbox"
                          checked={!!mainVisitor[field.name as keyof Visitor]}
                          onChange={(e) =>
                            handleInputChange(
                              null,
                              field.name as keyof Visitor,
                              e.target.checked
                            )
                          }
                        />
                      ) : (
                        <input
                          type={field.type}
                          value={
                            typeof mainVisitor[field.name as keyof Visitor] ===
                            "boolean"
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
                          className="w-full border rounded px-2 py-1"
                        />
                      )}
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <h2 className="font-semibold mb-2">Companions</h2>
              {companions.map((comp, idx) => (
                <div
                  key={idx}
                  className="border rounded p-3 mb-2 bg-gray-50 relative"
                >
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-red-500"
                    onClick={() => handleRemoveCompanion(idx)}
                    aria-label="Remove companion"
                  >
                    &times;
                  </button>
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
                        <label className="block font-medium mb-1">
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
                            className="w-full border rounded px-2 py-1"
                          >
                            <option value="">Select...</option>
                            {field.options?.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        ) : field.type === "checkbox" ? (
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
                          />
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
                            className="w-full border rounded px-2 py-1"
                          />
                        )}
                      </div>
                    ))}
                </div>
              ))}
              <Button type="button" onClick={handleAddCompanion}>
                Add Companion
              </Button>
            </div>
            {error && <div className="text-red-500">{error}</div>}
            <Button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>
        )}
      </div>
    </>
  );
}
