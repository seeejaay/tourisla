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

export interface LatestEntry {
  unique_code: string;
  qr_code_url: string;
  // payment_method: string;
  // status: string;
  // total_fee: number;
  payment_link?: string;
  paymongo_status?: string;
}

export default function IslandEntryPage() {
  const [companions, setCompanions] = useState<GroupMember[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showPaymentLink, setShowPaymentLink] = useState(false);
  const [latestEntry, setLatestEntry] = useState<LatestEntry | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const {
    loading,
    result,
    fee,
    fetchFee,
    register,
    // paymentLink,
    // checkPaymentStatus,
  } = useIslandEntryManager();

  useEffect(() => {
    fetchFee();
  }, [fetchFee]);

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
        payment_method: fee?.is_enabled
          ? values.payment_method.toUpperCase()
          : "NOT_REQUIRED",
        total_fee: fee ? fee.amount * groupMembers.length : 0,
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
  const totalFee = fee?.is_enabled ? fee.amount * totalPersons : 0;

  if (showResult && result) {
    return (
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-2">Registration Successful!</h2>
        {latestEntry && (
          <>
            <p>
              Your Unique Code:{" "}
              <span className="font-mono">{latestEntry.unique_code}</span>
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
        <button
          onClick={() =>
            (window.location.href = process.env.NEXT_PUBLIC_FRONTEND_URL || "/")
          }
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-[#e6f7fa] via-[#f0f0f0] to-[#b6e0e4] flex flex-col items-center justify-start px-4 pt-24 pb-20">
        <main className="w-full max-w-2xl pt-10">
          <div className="p-8 shadow-lg border border-[#e6f7fa] bg-white rounded-2xl space-y-8">
            <h1 className="text-3xl font-extrabold text-[#1c5461] text-center mb-2">
              Island Entry Registration
            </h1>
            <form onSubmit={formik.handleSubmit} className="space-y-8">
              {/* Main Visitor Fields */}
              <div>
                <h2 className="font-semibold text-lg mb-3 text-[#1c5461]">
                  Main Visitor
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-2 text-[#1c5461]">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      className="w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-[#f8fcfd] focus:ring-2 focus:ring-[#3e979f] focus:outline-none"
                      placeholder="Enter name"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-2 text-[#1c5461]">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formik.values.age}
                      onChange={formik.handleChange}
                      className="w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-[#f8fcfd] focus:ring-2 focus:ring-[#3e979f] focus:outline-none"
                      placeholder="Enter age"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block font-semibold mb-2 text-[#1c5461]">
                      Sex
                    </label>
                    <select
                      name="sex"
                      value={formik.values.sex}
                      onChange={formik.handleChange}
                      className="w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-[#f8fcfd] focus:ring-2 focus:ring-[#3e979f] focus:outline-none"
                    >
                      <option value="">Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 md:mt-0 mt-6">
                    <input
                      type="checkbox"
                      name="is_foreign"
                      checked={formik.values.is_foreign}
                      onChange={formik.handleChange}
                      className="accent-[#3e979f] scale-125"
                    />
                    <label className="font-semibold text-[#1c5461]">
                      Are you a foreign visitor?
                    </label>
                  </div>
                </div>
                {!formik.values.is_foreign && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block font-semibold mb-2 text-[#1c5461]">
                        Municipality
                      </label>
                      <input
                        type="text"
                        name="municipality"
                        value={formik.values.municipality}
                        onChange={formik.handleChange}
                        className="w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-[#f8fcfd] focus:ring-2 focus:ring-[#3e979f] focus:outline-none"
                        placeholder="Enter municipality"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-2 text-[#1c5461]">
                        Province
                      </label>
                      <input
                        type="text"
                        name="province"
                        value={formik.values.province}
                        onChange={formik.handleChange}
                        className="w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-[#f8fcfd] focus:ring-2 focus:ring-[#3e979f] focus:outline-none"
                        placeholder="Enter province"
                      />
                    </div>
                  </div>
                )}
                <div className="mt-4">
                  <label className="block font-semibold mb-2 text-[#1c5461]">
                    Country
                  </label>
                  <select
                    name="country"
                    value={formik.values.country}
                    onChange={formik.handleChange}
                    className="w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-[#f8fcfd] focus:ring-2 focus:ring-[#3e979f] focus:outline-none"
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
                    className="relative mb-8 rounded-xl bg-[#f8fcfd] border border-[#e6f7fa] shadow-sm p-6"
                  >
                    <button
                      type="button"
                      className="absolute top-4 right-4 text-red-500 text-2xl font-bold"
                      onClick={() => {
                        const updated = companions.filter((_, i) => i !== idx);
                        setCompanions(updated);
                        formik.setFieldValue("companions", updated);
                      }}
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
                          value={comp.name}
                          onChange={(e) =>
                            handleCompanionChange(idx, "name", e.target.value)
                          }
                          className="w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-[#3e979f] focus:outline-none"
                          placeholder="Enter name"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-2 text-[#1c5461]">
                          Age
                        </label>
                        <input
                          type="number"
                          value={comp.age}
                          onChange={(e) =>
                            handleCompanionChange(idx, "age", e.target.value)
                          }
                          className="w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-[#3e979f] focus:outline-none"
                          placeholder="Enter age"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-2 text-[#1c5461]">
                          Sex
                        </label>
                        <select
                          value={comp.sex}
                          onChange={(e) =>
                            handleCompanionChange(idx, "sex", e.target.value)
                          }
                          className="w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-[#3e979f] focus:outline-none"
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
                            handleCompanionChange(
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
                              value={comp.municipality}
                              onChange={(e) =>
                                handleCompanionChange(
                                  idx,
                                  "municipality",
                                  e.target.value
                                )
                              }
                              className="w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-[#3e979f] focus:outline-none"
                              placeholder="Enter municipality"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold mb-2 text-[#1c5461]">
                              Province
                            </label>
                            <input
                              type="text"
                              value={comp.province}
                              onChange={(e) =>
                                handleCompanionChange(
                                  idx,
                                  "province",
                                  e.target.value
                                )
                              }
                              className="w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-[#3e979f] focus:outline-none"
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
                          value={comp.country}
                          onChange={(e) =>
                            handleCompanionChange(
                              idx,
                              "country",
                              e.target.value
                            )
                          }
                          className="w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-[#3e979f] focus:outline-none"
                        >
                          <option value="">Select...</option>
                          <option value="Philippines">Philippines</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addCompanion}
                  className="mt-2 rounded-lg border border-[#3e979f] text-[#1c5461] hover:bg-[#e6f7fa] hover:text-[#3e979f] px-4 py-2 transition"
                >
                  Add Companion
                </button>
              </div>
              {/* Payment and Submit */}
              {fee?.is_enabled && (
                <div>
                  <label className="block font-semibold text-[#1c5461]">
                    Total to Pay:
                  </label>
                  <div className="text-xl font-bold text-green-700">
                    ₱{totalFee}
                  </div>
                </div>
              )}
              {fee?.is_enabled && (
                <div>
                  <label className="block font-semibold mb-1 text-[#1c5461]">
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
                        className="mr-2 accent-[#3e979f]"
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
                        className="mr-2 accent-[#3e979f]"
                      />
                      Online
                    </label>
                  </div>
                </div>
              )}
              {showPaymentLink && latestEntry?.payment_link && (
                <div className="mt-5 text-center space-y-3">
                  <p className="text-sm text-gray-600">
                    Proceed to online payment:
                  </p>
                  <a
                    href={latestEntry.payment_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-[#3e979f] hover:bg-[#1c5461] text-white px-4 py-2 rounded-lg font-semibold"
                  >
                    Pay via PayMongo
                  </a>
                  <p className="text-sm text-gray-500">
                    After paying, click the button below to confirm.
                  </p>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const updated = await getLatestIslandEntry();
                        setLatestEntry(updated);
                        setShowResult(true);
                        setShowPaymentLink(false);
                      } catch (err) {
                        console.error("Failed to confirm payment:", err);
                        alert("Something went wrong while confirming payment.");
                      }
                    }}
                    className="mt-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                  >
                    Confirm Payment
                  </button>
                </div>
              )}
              {!(
                formik.values.payment_method === "Online" &&
                hasSubmitted &&
                latestEntry?.payment_link
              ) && (
                <button
                  type="submit"
                  disabled={loading || !fee}
                  className="bg-[#3e979f] hover:bg-[#1c5461] text-white px-6 py-2 rounded-lg w-full font-bold text-lg shadow transition"
                >
                  {loading ? "Registering..." : "Submit"}
                </button>
              )}
            </form>
          </div>
        </main>
      </div>
    </>
  );
}
