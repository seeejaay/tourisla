"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useVisitorRegistration } from "@/hooks/useVisitorRegistration";

export default function ViewRegistration() {
  const params = useParams();
  const userId = params.id;
  const { getQRCodebyUserId, loading, error } = useVisitorRegistration();
  const [result, setResult] = useState<{
    qr_code_url: string;
    unique_code?: string;
  } | null>(null);

  useEffect(() => {
    if (userId) {
      getQRCodebyUserId(Number(userId)).then(setResult);
    }
  }, [userId, getQRCodebyUserId]);

  if (!userId) return <div>No user ID provided.</div>;
  if (loading) return <div>Loading...</div>;
  // Only show error if it's not a 404 (so we can show our own message)
  if (error && !error.includes("404"))
    return <div className="text-red-500">{error}</div>;
  if (!result)
    return (
      <div className="text-red-500 items-center justify-center flex flex-col gap-4 min-h-screen text-2xl">
        No registration found for this user.
      </div>
    );
  const handleDownload = async () => {
    const response = await fetch(result.qr_code_url, { mode: "cors" });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qr-code-${result.unique_code || "visitor"}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh] bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md flex flex-col items-center gap-6">
        <h2 className="text-2xl font-bold text-primary mb-2">
          Your Registration
        </h2>
        {result.unique_code && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-gray-600">Unique Code:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg bg-gray-100 px-3 py-1 rounded">
                {result.unique_code}
              </span>
              <button
                className="text-xs px-2 py-1 bg-primary text-white rounded hover:bg-primary/90 transition"
                onClick={() =>
                  navigator.clipboard.writeText(result.unique_code!)
                }
                title="Copy code"
              >
                Copy
              </button>
            </div>
          </div>
        )}
        {result.qr_code_url ? (
          <div className="flex flex-col items-center gap-2">
            <span className="text-gray-600">
              Show this QR code at the entrance:
            </span>
            <div className="bg-gray-100 p-4 rounded-lg flex flex-col items-center gap-2">
              <img
                src={result.qr_code_url}
                alt="QR Code"
                className="w-44 h-44 object-contain"
              />
              <a
                href={result.qr_code_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-xs px-3 py-1 bg-primary text-white rounded hover:bg-primary/90 transition"
              >
                View QR Code
              </a>
            </div>
          </div>
        ) : (
          <p className="text-red-500 font-medium mt-4 items-center ">
            No QR code available for this user.
          </p>
        )}
      </div>
    </div>
  );
}
