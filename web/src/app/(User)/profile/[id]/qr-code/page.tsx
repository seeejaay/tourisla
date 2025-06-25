"use client";

import React, { useRef, useState } from "react";
import { useOperatorQrManager } from "@/hooks/useOperatorQr";
import { useParams } from "next/navigation";
import OperatorUploadSchema from "@/app/static/operatorqr/operatorSchema";

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
    <div className="p-8 max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          QR Code Management
        </h1>
        <p className="text-gray-600">
          Upload and manage QR codes for your tour operator profile. These QR
          codes will link to your profile and tour packages.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Upload New QR Code
          </h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                } rounded-md`}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                QR Image
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  className={`flex flex-col w-full border-2 border-dashed ${
                    formErrors.qr_image
                      ? "border-red-400"
                      : "border-gray-300 hover:border-gray-400"
                  } rounded-md cursor-pointer`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 text-gray-500"
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                "Upload QR Code"
              )}
            </button>
          </form>

          {uploadedQr && (
            <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-100">
              <h3 className="font-medium text-blue-800 mb-2">
                Successfully Uploaded
              </h3>
              <p className="text-sm text-gray-700">
                Name: {uploadedQr.qr_name}
              </p>
              {uploadedQr.qr_image_url && (
                <div className="mt-3 flex justify-center">
                  <img
                    src={uploadedQr.qr_image_url}
                    alt={uploadedQr.qr_name}
                    className="w-32 h-32 object-contain border-2 border-white shadow-sm"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Fetch Section */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Your QR Codes
          </h2>
          <button
            onClick={handleFetch}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 mb-4"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
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
                  className="mt-3 flex flex-col items-center border-b pb-4 last:border-b-0"
                >
                  <p className="text-sm text-gray-700 mb-2">
                    Name: {qr.qr_name}
                  </p>
                  <img
                    src={qr.qr_image_url}
                    alt={qr.qr_name}
                    className="w-32 h-32 object-contain border-2 border-white shadow-sm mb-2"
                  />
                  <a
                    href={qr.qr_image_url}
                    download={`qr_${qr.qr_name}.png`}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Download QR Code
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No QR code fetched yet</p>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 rounded-md border border-red-200 text-red-600 text-center">
          {error}
        </div>
      )}
    </div>
  );
}
