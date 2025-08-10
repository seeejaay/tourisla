"use client";
import { useState, useEffect, useRef } from "react";
import { useIslandEntryManager } from "@/hooks/useIslandEntryManager";
import { islandEntrySchema } from "@/app/static/islandEntry/schema";
import { islandEntryFields } from "@/app/static/islandEntry/islandEntryFields";
import { useFormik } from "formik";
import { getLatestIslandEntry } from "@/lib/api/islandEntry";
import * as yup from "yup";
import Header from "@/components/custom/header";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { fetchRegions, fetchCities } from "@/lib/api/philippines";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

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
  expected_arrival_date: string;
  payment_method: string;
  total_fee: number;
}

export interface LatestEntry {
  unique_code: string;
  qr_code_url: string;
  payment_link?: string;
  paymongo_status?: string;
}
export interface User {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role?: string;
  birth_date: string;
  nationality: string;
  sex: string;
}

export interface Region {
  code: string;
  name: string;
  regionName: string;
  islandGroupCode: string;
  psgc10DigitCode: string;
}

export default function IslandEntryPage() {
  const router = useRouter();
  const [companions, setCompanions] = useState<GroupMember[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showPaymentLink, setShowPaymentLink] = useState(false);
  const [latestEntry, setLatestEntry] = useState<LatestEntry | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { loggedInUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const { loading, result, fee, fetchFee, register, markPaid } =
    useIslandEntryManager();

  // Caching regions/cities for performance
  const regionsCache = useRef<Region[] | null>(null);
  const citiesCache = useRef<{
    [key: string]: { code: string; name: string }[];
  } | null>(null);

  const [regionList, setRegions] = useState<Region[]>([]);
  const [cityList, setCities] = useState<{
    [key: string]: { code: string; name: string }[];
  }>({});

  useEffect(() => {
    async function fetchInitialData() {
      // Regions
      if (!regionsCache.current) {
        const regions = await fetchRegions();
        regionsCache.current = regions;
        setRegions(regions);
      } else {
        setRegions(regionsCache.current);
      }
      // Cities
      if (!citiesCache.current) {
        const cities = await fetchCities();
        const citiesByRegion: {
          [key: string]: { code: string; name: string }[];
        } = {};
        cities.forEach(
          (city: { name: string; regionCode: string; code: string }) => {
            if (!citiesByRegion[city.regionCode]) {
              citiesByRegion[city.regionCode] = [];
            }
            citiesByRegion[city.regionCode].push({
              code: city.code,
              name: city.name,
            });
          }
        );
        citiesCache.current = citiesByRegion;
        setCities(citiesByRegion);
      } else {
        setCities(citiesCache.current);
      }
    }

    async function fetchUserData() {
      const response = await loggedInUser(router);
      if (!response || !response.data?.user) {
        router.push("/auth/login?redirect=/islandEntry-regis");
      } else {
        const {
          first_name,
          last_name,
          email,
          phone_number,
          birth_date,
          nationality,
          sex,
        } = response.data.user;
        setUser({
          first_name,
          last_name,
          email,
          phone_number,
          birth_date,
          nationality,
          sex,
        } as User);
      }
    }

    fetchUserData();
    fetchFee();
    fetchInitialData();
  }, [loggedInUser, router, fetchFee]);

  useEffect(() => {
    if (showResult) {
      getLatestIslandEntry().then(setLatestEntry);
    }
  }, [showResult]);

  function getExactAge(birth_dateStr: string) {
    const birth_date = new Date(birth_dateStr);
    const today = new Date();
    let age = today.getFullYear() - birth_date.getFullYear();
    const m = today.getMonth() - birth_date.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth_date.getDate())) {
      age--;
    }
    return age;
  }

  const getInitialMainVisitor = (user: User | null) => ({
    name: user ? `${user.first_name} ${user.last_name}` : "",
    sex: user?.sex || "",
    age: user && user.birth_date ? getExactAge(user.birth_date) : 0,
    is_foreign: user?.nationality?.toLowerCase() !== "philippines",
    municipality: "",
    province: "",
    country: user?.nationality || "",
  });

  const getCitiesForRegionCode = (regionCode: string) => {
    return cityList[regionCode] || [];
  };

  const getRegionCodeByName = (regionName: string) => {
    return regionList.find((reg) => reg.name === regionName)?.code || "";
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...getInitialMainVisitor(user),
      expected_arrival_date: "",
      companions: [],
      payment_method: "Cash",
      total_fee: 0,
    },
    validationSchema: yup.object().shape({
      ...islandEntrySchema.fields,
      expected_arrival_date: yup
        .string()
        .required("Expected arrival date is required"),
      companions: yup.array().of(islandEntrySchema),
    }),
    onSubmit: async (values) => {
      // Ensure companions have country set if not foreign
      const sanitizedCompanions = values.companions.map((comp) => ({
        ...comp,
        country: comp.is_foreign ? comp.country : "Philippines",
      }));

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
        ...sanitizedCompanions,
      ];

      if (values.payment_method === "Online" && groupMembers.length < 3) {
        alert("Online payment is only available for groups of 3 or more.");
        return;
      }

      const payload = {
        groupMembers,
        expected_arrival_date: values.expected_arrival_date,
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
    const updated = companions.map((c, i) => {
      if (i !== idx) return c;
      // If is_foreign is unchecked, set country to Philippines
      if (field === "is_foreign" && value === false) {
        return { ...c, [field]: value, country: "Philippines" };
      }
      // If province changes, reset municipality
      if (field === "province") {
        return { ...c, [field]: value, municipality: "" };
      }
      return { ...c, [field]: value };
    });
    setCompanions(updated);
    formik.setFieldValue("companions", updated);
  };

  const totalPersons = 1 + companions.length;
  const totalFee = fee?.is_enabled ? fee.amount * totalPersons : 0;

  if (showResult && result) {
    return (
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow flex flex-col items-center">
        <h2 className="text-xl font-bold mb-2">Registration Successful!</h2>
        {latestEntry && (
          <>
            <p>
              Your Unique Code:{" "}
              <span className="font-mono">{latestEntry.unique_code}</span>
            </p>
            <Image
              width={160}
              height={160}
              src={latestEntry.qr_code_url}
              alt="QR Code"
              className="my-4 w-40 h-40"
            />
            <a
              href={latestEntry.qr_code_url}
              download={`island-entry-qr-${latestEntry.unique_code}.png`}
              className="mb-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              Download QR Code
            </a>
          </>
        )}
        <p className="text-green-700 font-semibold mb-4">
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
      <div className="min-h-screen bg-gradient-to-b from-[#e6f7fa] via-[#f0f0f0] to-[#b6e0e4] flex flex-col items-center justify-start px-4 pt-18 pb-20">
        <main className="w-full max-w-2xl pt-16">
          <div className="p-8 shadow-lg border border-[#e6f7fa] bg-white rounded-2xl space-y-8">
            <div>
              <h1 className="text-3xl font-extrabold text-[#1c5461] text-center mb-2">
                Island Entry Registration
              </h1>
              <p className="text-center text-[#51702c] mb-6">
                Register your group for island entry. Add companions if needed.
              </p>
            </div>
            <form onSubmit={formik.handleSubmit} className="space-y-8">
              <div>
                <h2 className="font-semibold text-lg mb-3 text-[#1c5461]">
                  Main Visitor
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {islandEntryFields.map((field) => {
                    if (field.showIf && !field.showIf(formik.values))
                      return null;
                    if (field.type === "select") {
                      // Sex field: autofill and readonly from user
                      if (field.name === "sex" && user) {
                        return (
                          <div key={field.name}>
                            <label className="block font-semibold mb-2 text-[#1c5461]">
                              {field.label}
                            </label>
                            <input
                              type="text"
                              name={field.name}
                              value={user.sex}
                              readOnly
                              disabled
                              className="w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-[#f0f0f0] cursor-not-allowed"
                              placeholder={`Enter ${field.label.toLowerCase()}`}
                            />
                          </div>
                        );
                      }
                      // Country field: shadcn Select
                      if (field.name === "country") {
                        return (
                          <div key={field.name}>
                            <label className="block font-semibold mb-2 text-[#1c5461]">
                              {field.label}
                            </label>
                            <input
                              type="text"
                              name={field.name}
                              value={user?.nationality}
                              className="w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-[#f0f0f0] cursor-not-allowed"
                              placeholder={`Enter ${field.label.toLowerCase()}`}
                              readOnly
                              disabled
                            />
                          </div>
                        );
                      }
                      // Province (region) dropdown: shadcn Select
                      if (field.name === "province") {
                        return (
                          <div key={field.name}>
                            <label className="block font-semibold mb-2 text-[#1c5461]">
                              Region
                            </label>
                            <Select
                              value={formik.values.province}
                              onValueChange={(value) => {
                                formik.setFieldValue("province", value);
                                formik.setFieldValue("municipality", "");
                              }}
                            >
                              <SelectTrigger className="w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-[#f8fcfd]">
                                <SelectValue placeholder="Select region..." />
                              </SelectTrigger>
                              <SelectContent className="max-h-40 overflow-y-auto">
                                {regionList.map((reg) => (
                                  <SelectItem key={reg.code} value={reg.name}>
                                    {reg.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        );
                      }
                      // Municipality (city) dropdown: shadcn Select
                      if (field.name === "municipality") {
                        const regionCode = getRegionCodeByName(
                          formik.values.province
                        );
                        const cities = getCitiesForRegionCode(regionCode);
                        return (
                          <div key={field.name}>
                            <label className="block font-semibold mb-2 text-[#1c5461]">
                              City / Municipality
                            </label>
                            <Select
                              value={formik.values.municipality}
                              onValueChange={(value) =>
                                formik.setFieldValue("municipality", value)
                              }
                              disabled={!formik.values.province}
                            >
                              <SelectTrigger className="w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-[#f8fcfd]">
                                <SelectValue placeholder="Select municipality..." />
                              </SelectTrigger>
                              <SelectContent className="max-h-40 overflow-y-auto">
                                {cities.map((city) => (
                                  <SelectItem key={city.code} value={city.name}>
                                    {city.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        );
                      }
                      // Default select: shadcn Select
                      return (
                        <div key={field.name}>
                          <label className="block font-semibold mb-2 text-[#1c5461]">
                            {field.label}
                          </label>
                          <Select
                            value={formik.values[field.name]}
                            onValueChange={(value) =>
                              formik.setFieldValue(field.name, value)
                            }
                          >
                            <SelectTrigger className="w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-[#f8fcfd]">
                              <SelectValue
                                placeholder={`Select ${field.label.toLowerCase()}...`}
                              />
                            </SelectTrigger>
                            <SelectContent className="max-h-40 overflow-y-auto">
                              {(field.options ?? []).map((opt) => (
                                <SelectItem
                                  key={
                                    typeof opt === "object"
                                      ? opt.value || opt.label
                                      : opt
                                  }
                                  value={
                                    typeof opt === "object" ? opt.value : opt
                                  }
                                >
                                  {typeof opt === "object" ? opt.label : opt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      );
                    }
                    if (field.type === "checkbox") {
                      return (
                        <div
                          key={field.name}
                          className="flex items-center mt-2 pt-4 cursor-not-allowed "
                        >
                          <input
                            type="checkbox"
                            name={field.name}
                            checked={formik.values[field.name]}
                            onChange={formik.handleChange}
                            className="accent-[#3e979f]  cursor-not-allowed"
                            disabled
                          />
                          <label className="font-medium text-[#1c5461] ml-2 cursor-not-allowed">
                            {field.label}
                          </label>
                        </div>
                      );
                    }
                    // Default: text/number input
                    return (
                      <div key={field.name}>
                        <label className="block font-semibold mb-2 text-[#1c5461]">
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          name={field.name}
                          value={formik.values[field.name]}
                          onChange={formik.handleChange}
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                          className="w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-[#f8fcfd]"
                          {...(field.name === "name" && user
                            ? {
                                value: `${user.first_name} ${user.last_name}`,
                                readOnly: true,
                                disabled: true,
                                className:
                                  "w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-[#f0f0f0] cursor-not-allowed",
                              }
                            : {})}
                          {...(field.name === "age" && user && user.birth_date
                            ? {
                                value: getExactAge(user.birth_date),
                                readOnly: true,
                                disabled: true,
                                className:
                                  "w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-[#f0f0f0] cursor-not-allowed",
                              }
                            : {})}
                        />
                        {formik.touched[field.name] &&
                          formik.errors[field.name] && (
                            <div className="text-red-500 text-xs mt-1">
                              {formik.errors[field.name]}
                            </div>
                          )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Expected Arrival Date */}
              <div>
                <label className="block font-semibold mb-2 text-[#1c5461]">
                  Expected Date of Arrival
                </label>
                <input
                  type="date"
                  name="expected_arrival_date"
                  value={formik.values.expected_arrival_date}
                  onChange={formik.handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-[#f8fcfd]"
                  required
                />
                {formik.touched.expected_arrival_date &&
                  formik.errors.expected_arrival_date && (
                    <div className="text-red-500 text-xs mt-1">
                      {formik.errors.expected_arrival_date}
                    </div>
                  )}
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
                      {islandEntryFields.map((field) => {
                        if (field.showIf && !field.showIf(comp)) return null;
                        if (field.type === "select") {
                          // Country field: dropdown for companions
                          if (field.name === "country") {
                            const isForeign = comp.is_foreign;
                            return (
                              <div key={field.name}>
                                <label className="block font-semibold mb-2 text-[#1c5461]">
                                  {field.label}
                                </label>
                                <Select
                                  value={
                                    isForeign ? comp.country : "Philippines"
                                  }
                                  onValueChange={(value) =>
                                    handleCompanionChange(
                                      idx,
                                      field.name as keyof GroupMember,
                                      value
                                    )
                                  }
                                  disabled={!isForeign}
                                >
                                  <SelectTrigger
                                    className={`w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-[#f8fcfd] ${
                                      !isForeign
                                        ? "cursor-not-allowed opacity-70"
                                        : ""
                                    }`}
                                  >
                                    <SelectValue placeholder="Select country..." />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-40 overflow-y-auto">
                                    {(field.options ?? []).map((opt) => (
                                      <SelectItem
                                        key={
                                          typeof opt === "object"
                                            ? opt.value || opt.label
                                            : opt
                                        }
                                        value={
                                          typeof opt === "object"
                                            ? opt.value
                                            : opt
                                        }
                                      >
                                        {typeof opt === "object"
                                          ? opt.label
                                          : opt}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                {!isForeign && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    Country is set to Philippines for local
                                    visitors.
                                  </div>
                                )}
                              </div>
                            );
                          }
                          // Province (region) dropdown for companions
                          if (field.name === "province") {
                            return (
                              <div key={field.name}>
                                <label className="block font-semibold mb-2 text-[#1c5461]">
                                  Region
                                </label>
                                <Select
                                  value={comp.province}
                                  onValueChange={(value) =>
                                    handleCompanionChange(
                                      idx,
                                      "province",
                                      value
                                    )
                                  }
                                >
                                  <SelectTrigger className="w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-[#f8fcfd]">
                                    <SelectValue placeholder="Select region..." />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-40 overflow-y-auto">
                                    {regionList.map((reg) => (
                                      <SelectItem
                                        key={reg.code}
                                        value={reg.name}
                                      >
                                        {reg.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            );
                          }

                          // Municipality (city) dropdown for companions
                          if (field.name === "municipality") {
                            const regionCode = getRegionCodeByName(
                              comp.province
                            );
                            const cities = getCitiesForRegionCode(regionCode);
                            return (
                              <div key={field.name}>
                                <label className="block font-semibold mb-2 text-[#1c5461]">
                                  City / Municipality
                                </label>
                                <Select
                                  value={comp.municipality}
                                  onValueChange={(value) =>
                                    handleCompanionChange(
                                      idx,
                                      "municipality",
                                      value
                                    )
                                  }
                                  disabled={!comp.province}
                                >
                                  <SelectTrigger className="w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-[#f8fcfd]">
                                    <SelectValue placeholder="Select municipality..." />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-40 overflow-y-auto">
                                    {cities.map((city) => (
                                      <SelectItem
                                        key={city.code}
                                        value={city.name}
                                      >
                                        {city.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            );
                          }
                          // Default select for companions
                          return (
                            <div key={field.name}>
                              <label className="block font-semibold mb-2 text-[#1c5461]">
                                {field.label}
                              </label>
                              <Select
                                value={comp[field.name as keyof GroupMember]}
                                onValueChange={(value) =>
                                  handleCompanionChange(
                                    idx,
                                    field.name as keyof GroupMember,
                                    value
                                  )
                                }
                              >
                                <SelectTrigger className="w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-[#f8fcfd]">
                                  <SelectValue
                                    placeholder={`Select ${field.label.toLowerCase()}...`}
                                  />
                                </SelectTrigger>
                                <SelectContent className="max-h-40 overflow-y-auto">
                                  {(field.options ?? []).map((opt) => (
                                    <SelectItem
                                      key={
                                        typeof opt === "object"
                                          ? opt.value || opt.label
                                          : opt
                                      }
                                      value={
                                        typeof opt === "object"
                                          ? opt.value
                                          : opt
                                      }
                                    >
                                      {typeof opt === "object"
                                        ? opt.label
                                        : opt}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
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
                                    field.name as keyof GroupMember,
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
                        // Default: text/number input for companions
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
                                  field.name as keyof GroupMember,
                                  e.target.value
                                )
                              }
                              className="w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-[#f8fcfd]"
                              placeholder={`Enter ${field.label.toLowerCase()}`}
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
                  className="mt-2 rounded-lg border-[#3e979f] text-[#1c5461] hover:bg-[#e6f7fa] hover:text-[#3e979f] transition px-4 py-2 border"
                >
                  Add Companion
                </button>
              </div>

              {/* Fee and Payment */}
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

              {/* Payment Link */}
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
                        const updated = await markPaid(latestEntry.unique_code);
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

              {/* Submit */}
              {!(
                formik.values.payment_method === "Online" &&
                hasSubmitted &&
                latestEntry?.payment_link
              ) && (
                <button
                  type="submit"
                  disabled={loading || !fee}
                  className="w-full rounded-lg bg-[#3e979f] text-white hover:bg-[#1c5461] transition px-6 py-2 font-bold text-lg shadow"
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
