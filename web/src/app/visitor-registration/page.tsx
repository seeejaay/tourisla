"use client";
import React, { useState, useEffect } from "react";
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
    // add other fields if needed
  };
  // add other fields if needed
};

export default function WalkInRegister() {
  const { loggedInUser } = useAuth();
  const [mainVisitor, setMainVisitor] = useState<Partial<Visitor>>(
    emptyVisitor()
  );
  const [companions, setCompanions] = useState<Partial<Visitor>[]>([]);
  const { createVisitor, loading, error } = useVisitorRegistration();
  const router = useRouter();

  // Initialize main visitor with logged-in user data if available
  useEffect(() => {
    async function checkUser() {
      const checkLogin = await loggedInUser(router);
      if (!checkLogin) {
        router.push("/auth/login");
        return;
      }
    }
    checkUser();
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

    console.log("Registration response:", response);

    // Redirect to result page with unique code as query param
    router.push(
      `/visitor-registration/result?code=${encodeURIComponent(
        response.registration.unique_code
      )}`
    );
  };

  return (
    <>
      <Header />
      <div className="max-w-xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Visitor Registration</h1>
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
      </div>
    </>
  );
}
