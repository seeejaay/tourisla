"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { visitorRegistrationFields } from "@/app/static/visitor-registration/visitor";
import { Visitor } from "@/app/static/visitor-registration/visitorSchema";
import visitorSchema from "@/app/static/visitor-registration/visitorSchema";
import { useVisitorRegistration } from "@/hooks/useVisitorRegistration";
import { Button } from "@/components/ui/button";
import Header from "@/components/custom/header";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import { fetchRegions, fetchCities } from "@/lib/api/philippines";
type FieldValue = string | boolean | number;

function getAge(birthDate: string): string {
  const dob = new Date(birthDate);
  const diffMs = Date.now() - dob.getTime();
  const ageDt = new Date(diffMs);
  return Math.abs(ageDt.getUTCFullYear() - 1970).toString();
}

const emptyVisitor = (): Visitor => ({
  name: "",
  age: 1,
  sex: "Male",
  is_foreign: false,
  municipality: "",
  province: "",
  country: "",
});

export interface Region {
  code: string;
  name: string;
  regionName: string;
  islandGroupCode: string;
  psgc10DigitCode: string;
}

export default function WalkInRegister() {
  const [regionList, setRegions] = useState<Region[]>([]);
  const [cityList, setCities] = useState<{
    [key: string]: { code: string; name: string }[];
  }>({});
  const [companions, setCompanions] = useState<Visitor[]>([]);
  const { createVisitor, loading, error } = useVisitorRegistration();
  const router = useRouter();
  const { loggedInUser } = useAuth();

  const [mainVisitor, setMainVisitor] = useState<Visitor>(emptyVisitor());
  const [formError, setFormError] = useState<string>("");

  useEffect(() => {
    async function checkuser() {
      const res = await loggedInUser(router);
      if (!res || !res.data?.user) {
        router.push("/auth/login?redirect=/visitor-registration");
        return;
      }

      setMainVisitor({
        name: `${res.data.user.first_name} ${res.data.user.last_name}`,
        sex: res.data.user.sex === "MALE" ? "Male" : "Female",
        country: res.data.user.nationality || "",
        is_foreign: res.data.user.nationality?.toLowerCase() !== "philippines",
        age: Number(getAge(res.data.user.birth_date)),
        municipality: "",
        province: "",
      });
    }
    fetchRegions().then((data) => {
      setRegions(data);
    });
    fetchCities().then((data) => {
      const citiesByRegion: {
        [key: string]: { code: string; name: string }[];
      } = {};
      data.forEach(
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
      setCities(citiesByRegion);
    });
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
    setFormError("");
    const group = [mainVisitor, ...companions];
    const groupSchema = z.array(visitorSchema);
    const result = groupSchema.safeParse(group);
    if (!result.success) {
      setFormError(result.error.errors[0].message);
      return;
    }
    try {
      const response = await createVisitor(group);
      if (!response || !response.members || response.members.length === 0) {
        console.log("Registration failed:", response);
        setFormError("Registration failed. Please try again.");
        return;
      }
      // Use the unique_code from registration
      const uniqueCode = response.registration?.unique_code ?? "";
      router.push(
        `/visitor-registration/result?code=${encodeURIComponent(uniqueCode)}`
      );
    } catch (err) {
      console.error(err);
      setFormError("Registration failed. Please try again.");
    }
  };
  // Helper: get cities for selected region code
  const getCitiesForRegionCode = (regionCode: string) => {
    return cityList[regionCode] || [];
  };

  // Helper: get region code from region name
  const getRegionCodeByName = (regionName: string) => {
    return regionList.find((reg) => reg.name === regionName)?.code || "";
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-2 text-[#1c5461]">
                      Name
                    </label>
                    <input
                      type="text"
                      value={mainVisitor.name}
                      disabled
                      readOnly
                      className="w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-[#f0f0f0]"
                      placeholder="Enter name"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-2 text-[#1c5461]">
                      Age
                    </label>
                    <input
                      type="number"
                      value={mainVisitor.age}
                      readOnly
                      disabled
                      className="w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-[#f0f0f0]"
                      placeholder="Enter age"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block font-semibold mb-2 text-[#1c5461]">
                      Sex
                    </label>
                    <input
                      type="text"
                      value={mainVisitor.sex}
                      readOnly
                      disabled
                      className="w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-[#f0f0f0]"
                      placeholder="Sex"
                    />
                  </div>
                  <div className="flex items-center gap-2 md:mt-0">
                    <input
                      type="checkbox"
                      checked={mainVisitor.is_foreign}
                      readOnly
                      disabled
                      className="accent-[#3e979f]"
                    />
                    <label className="font-medium text-[#1c5461]">
                      Are you a foreign visitor?
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-[#1c5461]">
                    Country
                  </label>
                  <input
                    type="text"
                    value={mainVisitor.country}
                    onChange={(e) =>
                      setMainVisitor((prev) => ({
                        ...prev,
                        country: e.target.value,
                      }))
                    }
                    className="w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-[#f0f0f0]"
                    placeholder="Enter country"
                    readOnly
                    disabled
                  />
                </div>
                {!mainVisitor.is_foreign && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block font-semibold mb-2 text-[#1c5461]">
                        Region
                      </label>
                      <select
                        value={mainVisitor.province}
                        onChange={(e) =>
                          setMainVisitor((prev) => ({
                            ...prev,
                            province: e.target.value,
                            municipality: "",
                          }))
                        }
                        className="w-full border border-[#3e979f] text-black rounded-lg px-3 py-2 bg-[#f8fcfd]"
                      >
                        <option value="">Select region...</option>
                        {regionList.map((reg) => (
                          <option key={reg.code} value={reg.name}>
                            {reg.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold mb-2 text-[#1c5461]">
                        City / Municipality
                      </label>
                      <select
                        value={mainVisitor.municipality}
                        onChange={(e) =>
                          setMainVisitor((prev) => ({
                            ...prev,
                            municipality: e.target.value,
                          }))
                        }
                        className="w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-[#f8fcfd]"
                        disabled={!mainVisitor.province}
                      >
                        <option value="">Select municipality...</option>
                        {getCitiesForRegionCode(
                          getRegionCodeByName(mainVisitor.province)
                        ).map((city) => (
                          <option key={city.code} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>
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
                          value={comp.name}
                          onChange={(e) =>
                            handleInputChange(idx, "name", e.target.value)
                          }
                          className="w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-[#f8fcfd]"
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
                          onChange={
                            (e) =>
                              handleInputChange(
                                idx,
                                "age",
                                Number(e.target.value)
                              ) // <-- convert to number
                          }
                          className="w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-[#f8fcfd]"
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
                            handleInputChange(idx, "sex", e.target.value)
                          }
                          className="w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-[#f8fcfd]"
                        >
                          <option value="">Select...</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
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
                        />
                        <label className="font-semibold text-[#1c5461]">
                          Are you a foreign visitor?
                        </label>
                      </div>
                      {!comp.is_foreign && (
                        <>
                          <div>
                            <label className="block font-semibold mb-2 text-[#1c5461]">
                              Region
                            </label>
                            <select
                              value={comp.province}
                              onChange={(e) =>
                                handleInputChange(
                                  idx,
                                  "province",
                                  e.target.value
                                )
                              }
                              className="w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-[#f8fcfd]"
                            >
                              <option value="">Select region...</option>
                              {regionList.map((reg) => (
                                <option key={reg.code} value={reg.name}>
                                  {reg.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block font-semibold mb-2 text-[#1c5461]">
                              City / Municipality
                            </label>
                            <select
                              value={comp.municipality}
                              onChange={(e) =>
                                handleInputChange(
                                  idx,
                                  "municipality",
                                  e.target.value
                                )
                              }
                              className="w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-[#f8fcfd]"
                              disabled={!comp.province}
                            >
                              <option value="">Select municipality...</option>
                              {getCitiesForRegionCode(
                                getRegionCodeByName(comp.province)
                              ).map((city) => (
                                <option key={city.code} value={city.name}>
                                  {city.name}
                                </option>
                              ))}
                            </select>
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
                            handleInputChange(idx, "country", e.target.value)
                          }
                          className="w-full border border-[#3e979f] rounded-lg px-3 py-2 bg-[#f8fcfd]"
                        >
                          <option value="">Select country...</option>
                          {(
                            visitorRegistrationFields.find(
                              (f) => f.name === "country"
                            )?.options ?? []
                          ).map((country: { value: string; label: string }) => (
                            <option key={country.value} value={country.value}>
                              {country.label}
                            </option>
                          ))}
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
              {formError && <div className="text-red-500">{formError}</div>}
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
