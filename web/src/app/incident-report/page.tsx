"use client";
import { useState } from "react";
import { useIncidentManager } from "@/hooks/useIncidentManager";
import Header from "@/components/custom/header";
import Footer from "@/components/custom/footer";
import { incidentFields } from "@/app/static/incident-report/incidentFields";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon } from "lucide-react";
export default function IncidentReportPage() {
  const { loading, submitReport } = useIncidentManager();

  const [incidentType, setIncidentType] = useState("");
  const [location, setLocation] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [incidentTime, setIncidentTime] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("incident_type", incidentType);
    formData.append("location", location);
    formData.append("incident_date", incidentDate);
    formData.append("incident_time", incidentTime);
    formData.append("description", description);
    if (photo) {
      formData.append("photo", photo);
    }
    for (const pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }
    try {
      await submitReport(formData);
      setSubmitted(true);
    } catch (error) {
      console.error("Submission failed", error);
      alert("Something went wrong while submitting the report.");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#e6f7fa] via-[#f0f0f0] to-[#b6e0e4]">
        <div className="max-w-lg w-full bg-white/90 rounded-2xl shadow-2xl border border-[#e6f7fa] p-8 text-center">
          <h2 className="text-2xl font-bold mb-2 text-green-700">
            Report Submitted Successfully!
          </h2>
          <p className="mb-4 text-gray-700">
            Your incident report has been received by the tourism office.
          </p>
          <button
            onClick={() =>
              (window.location.href =
                process.env.NEXT_PUBLIC_FRONTEND_URL || "/")
            }
            className="bg-[#3e979f] hover:bg-[#1c5461] text-white px-6 py-2 rounded-lg font-semibold shadow transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-[#e6f7fa] via-[#f0f0f0] to-[#b6e0e4] flex flex-col items-center justify-center px-4 pt-24 pb-20">
        <main className="w-full max-w-2xl pt-16">
          <div className="p-8 shadow-lg border border-[#e6f7fa] bg-white rounded-2xl space-y-8">
            <div>
              <h1 className="text-3xl font-extrabold text-[#1c5461] text-center mb-2">
                Incident Report Form
              </h1>
              <p className="text-center text-[#51702c] mb-6">
                Please fill out the details below to report an incident.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2 text-[#1c5461]">
                    Incident Type
                  </label>
                  <input
                    type="text"
                    value={incidentType}
                    onChange={(e) => setIncidentType(e.target.value)}
                    required
                    className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                    placeholder="e.g. Lost Item, Accident, etc."
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-[#1c5461]">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                    placeholder="Where did it happen?"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2 text-[#1c5461]">
                    Date
                  </label>
                  <input
                    type="date"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    required
                    className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-[#1c5461]">
                    Time
                  </label>
                  <input
                    type="time"
                    value={incidentTime}
                    onChange={(e) => setIncidentTime(e.target.value)}
                    required
                    className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-2 text-[#1c5461]">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                  placeholder="Describe what happened..."
                ></textarea>
              </div>
              <div>
                <label className="block font-semibold mb-2 text-[#1c5461]">
                  Optional Photo
                </label>
                <label
                  htmlFor="incident-photo"
                  className="inline-block bg-[#e6f7fa] text-[#1c5461] px-4 py-2 rounded cursor-pointer hover:bg-[#b6e0e4] transition"
                >
                  Choose File
                </label>
                <input
                  id="incident-photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setPhoto(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
                {photo && (
                  <p className="text-sm text-gray-600 mt-1">
                    Selected: {photo.name}
                  </p>
                )}
              </div> */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {incidentFields.map((field) => {
                  if (field.type === "select") {
                    return (
                      <div key={field.name}>
                        <label className="block font-semibold mb-2 text-[#1c5461]">
                          {field.label}
                        </label>
                        <Select
                          value={
                            field.name === "incident_type"
                              ? incidentType
                              : location
                          }
                          onValueChange={(value) => {
                            if (field.name === "incident_type")
                              setIncidentType(value);
                            if (field.name === "location") setLocation(value);
                          }}
                        >
                          <SelectTrigger className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]">
                            <SelectValue placeholder={field.placeholder} />
                          </SelectTrigger>
                          <SelectContent className="max-h-60 overflow-y-auto">
                            {(field.options ?? []).map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    );
                  }
                  if (field.type === "file") {
                    return (
                      <div key={field.name} className="space-y-2 w-full ">
                        <label className="block font-semibold mb-3 text-[#1c5461]">
                          {field.label}
                        </label>
                        <label
                          htmlFor={field.name}
                          className=" border border-[#3e979f] rounded-lg py-[8px] px-[8px] focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd] text-sm text-[#5e5d5d] cursor-pointer hover:bg-[#b6e0e4] transition"
                        >
                          Choose File
                        </label>
                        <Input
                          id={field.name}
                          type="file"
                          accept={field.accept}
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              setPhoto(e.target.files[0]);
                            }
                          }}
                          className="hidden "
                        />
                        {photo && (
                          <p className="text-sm text-gray-600 mt-1">
                            Selected: {photo.name.slice(0, 10)}
                          </p>
                        )}
                      </div>
                    );
                  }
                  if (field.type === "date") {
                    return (
                      <div key={field.name} className="space-y-2">
                        <label className="block font-semibold mb-2 text-[#1c5461]">
                          {field.label}
                        </label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd] flex items-center justify-between">
                              <span className="text-gray-500 text-sm">
                                {incidentDate || "Select Date"}
                              </span>
                              <CalendarIcon className="text-[#3e979f] w-4 h-4" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="p-0 flex items-center justify-center">
                            <Calendar
                              mode="single"
                              selected={
                                incidentDate
                                  ? new Date(incidentDate)
                                  : undefined
                              }
                              onSelect={(date) => {
                                if (date) {
                                  setIncidentDate(
                                    `${date.getFullYear()}-${String(
                                      date.getMonth() + 1
                                    ).padStart(2, "0")}-${String(
                                      date.getDate()
                                    ).padStart(2, "0")}`
                                  );
                                }
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    );
                  }
                  return (
                    <div key={field.name}>
                      <label className="block font-semibold mb-2 text-[#1c5461]">
                        {field.label}
                      </label>
                      <Input
                        type={field.type}
                        onChange={(e) => {
                          switch (field.name) {
                            case "incident_type":
                              setIncidentType(e.target.value);
                              break;
                            case "location":
                              setLocation(e.target.value);
                              break;
                            case "incident_date":
                              setIncidentDate(e.target.value);
                              break;
                            case "incident_time":
                              setIncidentTime(e.target.value);
                              break;
                            case "description":
                              setDescription(e.target.value);
                              break;
                            default:
                              break;
                          }
                        }}
                        className="w-full border border-[#3e979f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3e979f] focus:outline-none bg-[#f8fcfd]"
                        placeholder={field.placeholder}
                      />
                    </div>
                  );
                })}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#3e979f] text-white hover:bg-[#1c5461] transition font-bold text-lg py-3 shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Report"}
              </button>
            </form>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
