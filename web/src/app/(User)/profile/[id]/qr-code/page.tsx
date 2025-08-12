"use client";

import React, { useRef, useState } from "react";
import { useOperatorQrManager } from "@/hooks/useOperatorQr";
import { useParams } from "next/navigation";
import OperatorUploadSchema from "@/app/static/operatorqr/operatorSchema";
// import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
type OperatorQr = {
  id: number;
  tour_operator_id: number;
  qr_name: string;
  qr_image_url: string;
  created_at: string;
};

export default function QRCodePage() {
  const { uploadQr, fetchQr, loading, error } = useOperatorQrManager();
  const [qrName, setQrName] = useState("");
  const [qrImage, setQrImage] = useState<File | null>(null);
  const [uploadedQr, setUploadedQr] = useState<OperatorQr | null>(null);
  const [operatorQrs, setOperatorQrs] = useState<OperatorQr[]>([]);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const params = useParams();
  const TOUROPERATOR_ID = params.id as string;
  // const { loggedInUser } = useAuth();

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setQrImage(e.target.files[0]);
      setFormErrors((prev) => ({ ...prev, qr_image: "" }));
    }
  };

  // Handle upload with Zod validation
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = OperatorUploadSchema.safeParse({
      qr_name: qrName,
      qr_image: qrImage,
    });
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      setFormErrors({
        qr_name: errors.qr_name?.[0] || "",
        qr_image: errors.qr_image?.[0] || "",
      });
      return;
    }
    setFormErrors({});
    try {
      const uploadResult = await uploadQr(qrImage!, TOUROPERATOR_ID, qrName);
      setUploadedQr(uploadResult);
      setQrImage(null);
      setQrName("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      // error handled by hook
      console.error("Error uploading QR code:", err);
    }
  };

  // Handle fetch
  const handleFetch = async () => {
    try {
      const qrData = await fetchQr(TOUROPERATOR_ID);
      setOperatorQrs(Array.isArray(qrData.data) ? qrData.data : []);
    } catch (err) {
      // error handled by hook
      console.error("Error fetching QR code:", err);
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen w-full bg-gradient-to-br from-[#e6f7fa] via-white to-[#b6e0e4] px-2 py-8">
      <div className="w-full max-w-6xl flex flex-col items-center gap-6">
        <div className="w-full flex flex-col items-center gap-2">
          <h1 className="text-4xl font-extrabold text-center text-[#1c5461] tracking-tight">
            QR Code Management
          </h1>
          <p className="text-lg text-[#51702c] text-center">
            Upload and manage QR codes for your tour operator profile. These QR
            codes will link to your profile and tour packages.
          </p>
        </div>
        <div className="w-full flex flex-col md:flex-row gap-8 items-start">
          {/* Upload Section */}
          <div className="flex-1 bg-white rounded-2xl shadow-xl border border-[#e6f7fa] p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-[#1c5461] mb-4">
              Upload New QR Code
            </h2>
            <form onSubmit={handleUpload} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  QR Code Name
                </label>
                <input
                  type="text"
                  value={qrName}
                  onChange={(e) => {
                    setQrName(e.target.value);
                    setFormErrors((prev) => ({ ...prev, qr_name: "" }));
                  }}
                  className={`w-full px-4 py-2 border ${
                    formErrors.qr_name
                      ? "border-red-400 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-2 focus:ring-[#1c5461] focus:border-[#1c5461]"
                  } rounded-md bg-white`}
                  placeholder="Enter QR code name"
                  required
                />
                {formErrors.qr_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.qr_name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  QR Image
                </label>
                <div className="flex items-center justify-center w-full">
                  <label
                    className={`flex flex-col w-full border-2 border-dashed ${
                      formErrors.qr_image
                        ? "border-red-400"
                        : "border-gray-300 hover:border-[#1c5461]"
                    } rounded-md cursor-pointer transition`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        ></path>
                      </svg>
                      <p className="text-sm text-gray-500 mt-2">
                        {fileInputRef.current?.files &&
                        fileInputRef.current.files[0]
                          ? fileInputRef.current.files[0].name
                          : "Click to select QR image"}
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      className="hidden"
                      name="qr_image"
                      required
                    />
                  </label>
                </div>
                {formErrors.qr_image && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.qr_image}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-[#1c5461] hover:bg-[#17424c] text-white font-semibold py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#1c5461] focus:ring-offset-2 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                    Uploading...
                  </span>
                ) : (
                  "Upload QR Code"
                )}
              </button>
            </form>
            {uploadedQr && (
              <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-100 text-center">
                <h3 className="font-semibold text-blue-800 mb-2">
                  Successfully Uploaded
                </h3>
                <p className="text-sm text-gray-700">
                  Name: {uploadedQr.qr_name}
                </p>
                {uploadedQr.qr_image_url && (
                  <div className="mt-3 flex justify-center">
                    <Image
                      height={128}
                      width={128}
                      src={uploadedQr.qr_image_url}
                      alt={uploadedQr.qr_name}
                      className="w-32 h-32 object-contain border-2 border-white shadow-sm rounded"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Fetch Section */}
          <div className="flex-1 bg-white rounded-2xl shadow-xl border border-[#e6f7fa] p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-[#1c5461] mb-4">
              Your QR Codes
            </h2>
            <button
              onClick={handleFetch}
              className="w-full bg-[#51702c] hover:bg-[#3a511f] text-white font-semibold py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#51702c] focus:ring-offset-2 disabled:opacity-50 mb-4"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                  Fetching...
                </span>
              ) : (
                "Fetch My QR Codes"
              )}
            </button>
            {operatorQrs.length > 0 ? (
              <div className="space-y-6">
                {operatorQrs.map((qr) => (
                  <div
                    key={qr.id}
                    className="mt-3 flex flex-col items-center bg-[#f7fafc] border border-[#e6f7fa] rounded-xl shadow p-4 transition hover:shadow-lg"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-block bg-blue-100 text-[#1c5461] text-xs font-semibold px-3 py-1 rounded-full">
                        QR
                      </span>
                      <p className="text-base text-[#1c5461] font-bold">
                        {qr.qr_name}
                      </p>
                    </div>
                    <Image
                      height={128}
                      width={128}
                      src={qr.qr_image_url}
                      alt={qr.qr_name}
                      className="w-32 h-32 object-cover border-2 border-[#e6f7fa] shadow rounded-lg mb-3 bg-white"
                    />
                    <a
                      href={qr.qr_image_url}
                      download={`qr_${qr.qr_name}.png`}
                      target="_blank"
                      className="text-sm bg-[#1c5461] hover:bg-[#17424c] text-white font-semibold px-4 py-1 rounded transition mb-2"
                    >
                      Download QR Code
                    </a>
                    <span className="text-xs text-gray-500 mt-1">
                      Uploaded:{" "}
                      {new Date(qr.created_at).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No QR code fetched yet</p>
            )}
          </div>
        </div>
        {error && (
          <div className="text-[#c0392b] bg-red-50 border border-red-200 rounded-lg p-3 mt-6 text-center w-full max-w-lg">
            {error}
          </div>
        )}
      </div>
    </main>
  );
}
