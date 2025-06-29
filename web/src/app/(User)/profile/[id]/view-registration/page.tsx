"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useVisitorRegistration } from "@/hooks/useVisitorRegistration";
import Image from "next/image";
export default function ViewRegistration() {
  const params = useParams();
  const userId = params.id;
  const { getQRCodebyUserId, loading, error } = useVisitorRegistration();
  const [result, setResult] = useState<{
    qr_code_url: string;
    unique_code?: string;
  } | null>(null);

  const handleDownload = async () => {
    if (!result?.qr_code_url) return;
    const response = await fetch(result.qr_code_url);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tourisla-qr-${result.unique_code || "code"}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (userId) {
      getQRCodebyUserId(Number(userId)).then(setResult);
    }
  }, [userId, getQRCodebyUserId]);

  if (!userId) return <div>No user ID provided.</div>;
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#e6f7fa] via-[#f0f0f0] to-[#b6e0e4]">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full border border-[#e6f7fa]">
          <h1 className="text-2xl font-bold mb-4 text-center text-[#1c5461]">
            Loading Registration...
          </h1>
        </div>
      </div>
    );
  if (error && !error.includes("404"))
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#e6f7fa] via-[#f0f0f0] to-[#b6e0e4]">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full border border-[#e6f7fa]">
          <p className="text-red-500 text-center">{error}</p>
        </div>
      </div>
    );
  if (!result)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#e6f7fa] via-[#f0f0f0] to-[#b6e0e4]">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full border border-[#e6f7fa]">
          <p className="text-[#c0392b] text-center text-xl font-semibold">
            No registration found for this user.
          </p>
        </div>
      </div>
    );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#e6f7fa] via-[#f0f0f0] to-[#b6e0e4]">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md flex flex-col items-center gap-6 border border-[#e6f7fa]">
        <h2 className="text-2xl font-bold text-[#1c5461] mb-2">
          Your Registration
        </h2>
        {result.unique_code && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-[#51702c]">Unique Code:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg bg-[#f8fcfd] px-3 py-1 rounded border border-[#e6f7fa] text-[#1c5461]">
                {result.unique_code}
              </span>
              <button
                className="text-xs px-2 py-1 bg-[#3e979f] text-white rounded hover:bg-[#1c5461] transition"
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
            <span className="text-[#51702c]">
              Show this QR code at the entrance:
            </span>
            <div className="bg-[#f8fcfd] p-4 rounded-lg flex flex-col items-center gap-2 border border-[#e6f7fa]">
              <Image
                width={176}
                height={176}
                src={result.qr_code_url}
                alt="QR Code"
                className="w-44 h-44 object-contain"
              />
              <a
                href={result.qr_code_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-xs px-3 py-1 bg-[#3e979f] text-white rounded hover:bg-[#1c5461] transition"
              >
                View QR Code
              </a>
              <button
                type="button"
                onClick={handleDownload}
                className="mt-2 text-xs px-3 py-1 bg-[#51702c] text-white rounded hover:bg-[#3e979f] transition"
              >
                Download QR Code
              </button>
            </div>
          </div>
        ) : (
          <p className="text-[#c0392b] font-medium mt-4 items-center ">
            No QR code available for this user.
          </p>
        )}
      </div>
    </div>
  );
}
