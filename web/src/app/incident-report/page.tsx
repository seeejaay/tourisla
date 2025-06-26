"use client";
import { useState } from "react";
import { useIncidentManager } from "@/hooks/useIncidentManager";
import Header from "@/components/custom/header";

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
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow text-center">
        <h2 className="text-xl font-bold mb-2 text-green-700">Report Submitted Successfully!</h2>
        <p className="mb-4 text-gray-700">Your incident report has been received by the tourism office.</p>
        <button
          onClick={() => window.location.href = process.env.NEXT_PUBLIC_FRONTEND_URL || "/"}
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
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-blue-700 text-center">Incident Report Form</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Incident Type</label>
            <input
              type="text"
              value={incidentType}
              onChange={(e) => setIncidentType(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-semibold text-gray-700">Date</label>
              <input
                type="date"
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-semibold text-gray-700">Time</label>
              <input
                type="time"
                value={incidentTime}
                onChange={(e) => setIncidentTime(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            ></textarea>
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Optional Photo</label>

            <label
                htmlFor="incident-photo"
                className="inline-block bg-gray-300 text-gray-800 px-4 py-2 rounded cursor-pointer hover:bg-gray-400"
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
                <p className="text-sm text-gray-600 mt-1">Selected: {photo.name}</p>
            )}
            </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg w-full font-bold text-lg"
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </div>
    </>
  );
}
