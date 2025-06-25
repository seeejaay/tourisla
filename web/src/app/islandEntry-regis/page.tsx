"use client";
import { useState, useEffect } from "react";
import { useIslandEntryManager } from "@/hooks/useIslandEntryManager";
import { islandEntrySchema } from "@/app/static/islandEntry/schema";
import { islandEntryFields } from "@/app/static/islandEntry/islandEntryFields";
import { useFormik } from "formik";
import { getLatestIslandEntry } from "@/lib/api/islandEntry";
import * as yup from "yup";
import Header from "@/components/custom/header";

export interface GroupMember {
  name: string;
  sex: string;
  age: number;
  is_foreign: boolean;
  municipality: string;
  province: string;
  country: string;
}

export interface RegistrationPayload {
  groupMembers: GroupMember[];
  payment_method: string;
  total_fee: number;
}

export default function IslandEntryPage() {
  const [companions, setCompanions] = useState<GroupMember[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showPaymentLink, setShowPaymentLink] = useState(false);
  const [latestEntry, setLatestEntry] = useState<any>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const {
    loading,
    result,
    fee,
    fetchFee,
    register,
    paymentLink,
    checkPaymentStatus,
  } = useIslandEntryManager();

  useEffect(() => {
    fetchFee();
  }, []);

  useEffect(() => {
    if (showResult) {
      getLatestIslandEntry().then(setLatestEntry);
    }
  }, [showResult]);

  const formik = useFormik({
    initialValues: {
      name: "",
      sex: "",
      age: 0,
      is_foreign: false,
      municipality: "",
      province: "",
      country: "",
      companions: [],
      payment_method: "Cash",
      total_fee: 0,
    },
    validationSchema: yup.object().shape({
      ...islandEntrySchema.fields,
      companions: yup.array().of(islandEntrySchema),
    }),
    onSubmit: async (values) => {
      const groupMembers = [
        {
          name: values.name,
          sex: values.sex,
          age: values.age,
          is_foreign: values.is_foreign,
          municipality: values.municipality,
          province: values.province,
          country: values.country,
        },
        ...values.companions,
      ];

      if (values.payment_method === "Online" && groupMembers.length < 3) {
        alert("Online payment is only available for groups of 3 or more.");
        return;
      }

      const payload = {
        groupMembers,
        payment_method: values.payment_method.toUpperCase(),
        total_fee: fee ? fee * groupMembers.length : 0,
      };

      try {
        const res = await register(payload);

        if (res?.payment_link && values.payment_method === "Online") {
          setLatestEntry(res);
          setHasSubmitted(true);
          setShowPaymentLink(true);
        } else if (res) {
          const latest = await getLatestIslandEntry();
          setLatestEntry(latest);
          setShowResult(true);
        }
      } catch (err) {
        console.error("Registration failed", err);
      }
    },
  });

  const addCompanion = () => {
    const updated = [
      ...companions,
      {
        name: "",
        sex: "",
        age: 0,
        is_foreign: false,
        municipality: "",
        province: "",
        country: "",
      },
    ];
    setCompanions(updated);
    formik.setFieldValue("companions", updated);
  };

  const handleCompanionChange = (
    idx: number,
    field: keyof GroupMember,
    value: string | boolean | number
  ) => {
    const updated = companions.map((c, i) =>
      i === idx ? { ...c, [field]: value } : c
    );
    setCompanions(updated);
    formik.setFieldValue("companions", updated);
  };

  const totalPersons = 1 + companions.length;
  const totalFee = fee ? fee * totalPersons : 0;

  if (showResult && result) {
    return (
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-2">Registration Successful!</h2>
        {latestEntry && (
          <>
            <p>
              Your Unique Code: <span className="font-mono">{latestEntry.unique_code}</span>
            </p>
            <img
              src={latestEntry.qr_code_url}
              alt="QR Code"
              className="my-4 w-40 h-40"
            />
          </>
        )}
        <p className="text-green-700 font-semibold">
          Show this QR code at the entry point.
        </p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-3xl font-extrabold mb-6 text-blue-700 text-center">
          Island Entry Registration
        </h1>
        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {islandEntryFields.map((field) => {
            if (field.showIf && !field.showIf(formik.values)) return null;
            if (field.type === "select") {
              return (
                <div key={field.name}>
                  <label className="block mb-1 font-semibold text-gray-700">
                    {field.label}
                  </label>
                  <select
                    name={field.name}
                    value={formik.values[field.name]}
                    onChange={formik.handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select</option>
                    {field.options.map((opt: string) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {formik.touched[field.name] && formik.errors[field.name] && (
                    <div className="text-red-500 text-xs mt-1">
                      {formik.errors[field.name]}
                    </div>
                  )}
                </div>
              );
            }
            if (field.type === "checkbox") {
              return (
                <div key={field.name} className="flex items-center">
                  <input
                    type="checkbox"
                    name={field.name}
                    checked={formik.values[field.name]}
                    onChange={formik.handleChange}
                    className="mr-2 accent-blue-600"
                  />
                  <label className="font-semibold text-gray-700">
                    {field.label}
                  </label>
                </div>
              );
            }
            return (
              <div key={field.name}>
                <label className="block mb-1 font-semibold text-gray-700">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formik.values[field.name]}
                  onChange={formik.handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {formik.touched[field.name] && formik.errors[field.name] && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors[field.name]}
                  </div>
                )}
              </div>
            );
          })}

          <div>
            <h3 className="font-bold mb-2 text-gray-800">Companions</h3>
            {companions.map((comp, idx) => (
              <div
                key={idx}
                className="border border-gray-200 p-3 mb-3 rounded-lg bg-gray-50"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-blue-600">
                    Companion {idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = companions.filter((_, i) => i !== idx);
                      setCompanions(updated);
                      formik.setFieldValue("companions", updated);
                    }}
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
                        <label className="block text-gray-600">
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
                          className="w-full border border-gray-300 rounded-lg px-2 py-1"
                        >
                          <option value="">Select</option>
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
                      <div key={field.name} className="mb-1 flex items-center">
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
                          className="mr-2 accent-blue-600"
                        />
                        <label className="text-gray-600">{field.label}</label>
                      </div>
                    );
                  }
                  return (
                    <div key={field.name} className="mb-1">
                      <label className="block text-gray-600">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        value={comp[field.name]}
                        onChange={(e) =>
                          handleCompanionChange(idx, field.name, e.target.value)
                        }
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

          <div>
            <label className="block font-semibold text-gray-700">
              Total to Pay:
            </label>
            <div className="text-xl font-bold text-green-700">
              {fee ? `₱${totalFee}` : "Loading..."}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Payment Method
            </label>
            <div className="flex gap-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="payment_method"
                  value="Cash"
                  checked={formik.values.payment_method === "Cash"}
                  onChange={formik.handleChange}
                  className="mr-2 accent-blue-600"
                />
                Cash
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="payment_method"
                  value="Online"
                  checked={formik.values.payment_method === "Online"}
                  onChange={formik.handleChange}
                  className="mr-2 accent-blue-600"
                />
                Online
              </label>
            </div>
          </div>

          {showPaymentLink && latestEntry?.payment_link && (
            <div className="mt-5 text-center space-y-3">
              <p className="text-sm text-gray-600">Proceed to online payment:</p>
              <a
                href={latestEntry.payment_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Pay via PayMongo
              </a>
              <p className="text-sm text-gray-500">
                After paying, click the button below to confirm.
              </p>
              <button
                type="button"
                onClick={async () => {
                  const updated = await checkPaymentStatus(latestEntry.unique_code);
                  if (updated?.paymongo_status === "PAID") {
                    setLatestEntry(updated);
                    setShowResult(true);
                    setShowPaymentLink(false);
                  } else {
                    alert("Payment is still pending. Please try again shortly.");
                  }
                }}
                className="mt-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
              >
                Confirm Payment
              </button>
            </div>
          )}

          {!(formik.values.payment_method === "Online" && hasSubmitted && latestEntry?.payment_link) && (
          <button
            type="submit"
            disabled={loading || !fee}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg w-full font-bold text-lg shadow transition"
          >
            {loading ? "Registering..." : "Submit"}
          </button>
        )}
        </form>
      </div>
    </>
  );
}