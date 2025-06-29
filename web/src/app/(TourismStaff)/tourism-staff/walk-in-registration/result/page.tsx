"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useVisitorRegistration } from "@/hooks/useVisitorRegistration";

function WalkInRegistrationResultInner() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const { getVisitorResultByCode, loading, error } = useVisitorRegistration();
  const [result, setResult] = useState<{
    unique_code: string;
    qr_code_url: string;
  } | null>(null);

  useEffect(() => {
    if (code) {
      getVisitorResultByCode(code).then((res) => {
        if (res && res.registration) {
          setResult({
            unique_code: res.registration.unique_code,
            qr_code_url: res.registration.qr_code_url,
          });
        }
      });
    }
  }, [code, getVisitorResultByCode]);

  if (!code)
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="text-lg text-gray-600">No code provided.</div>
      </div>
    );
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="text-red-600 font-medium">{error}</div>
      </div>
    );
  if (!result)
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
        <div className="text-gray-600">Loading...</div>
      </div>
    );

  return (
    <div className="flex flex-col items-center gap-6 mt-12 bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-[#1c5461] mb-2">
        Registration Complete!
      </h2>
      <div className="flex flex-col items-center gap-2">
        <span className="text-gray-700">Unique code:</span>
        <span className="font-mono text-lg bg-gray-100 px-4 py-2 rounded text-blue-700 tracking-widest">
          {result.unique_code}
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-gray-700">
          Show this QR code to the tourist so they can take a picture:
        </span>
        <img
          src={result.qr_code_url}
          alt="QR Code"
          className="w-44 h-44 border-4 border-blue-100 rounded-lg shadow"
        />
      </div>
    </div>
  );
}

export default function WalkInRegistrationResult() {
  return (
    <>
      <main className="min-h-screen w-full bg-gradient-to-b from-[#e6f7fa] to-white flex flex-col items-center justify-center py-12 px-2">
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center min-h-[40vh]">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
              <div className="text-gray-600">Loading...</div>
            </div>
          }
        >
          <WalkInRegistrationResultInner />
        </Suspense>
      </main>
    </>
  );
}
