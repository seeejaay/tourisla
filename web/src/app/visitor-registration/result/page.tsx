"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useVisitorRegistration } from "@/hooks/useVisitorRegistration";

function VisitorRegistrationResultInner() {
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

  if (!code) return <div>No code provided.</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!result) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      <h2 className="text-2xl font-semibold">Registration Complete!</h2>
      <p>
        Your unique code:{" "}
        <span className="font-mono">{result.unique_code}</span>
      </p>
      <p>Show this QR code at the entrance:</p>
      <img src={result.qr_code_url} alt="QR Code" className="w-44 h-44" />
    </div>
  );
}

export default function VisitorRegistrationResult() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VisitorRegistrationResultInner />
    </Suspense>
  );
}
