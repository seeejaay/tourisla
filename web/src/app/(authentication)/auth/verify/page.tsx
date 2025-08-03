"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { verifyUserAccount, error, loading } = useAuth();
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (token) {
      verifyUserAccount(token).then((res) => {
        if (res && !res.error) {
          setSuccess(true);
          setTimeout(() => router.push("/auth/login"), 3000);
        }
      });
    }
  }, [token, verifyUserAccount, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0f8fa]">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-[#1c5461]">
          Email Verification
        </h1>
        {loading && <p className="text-[#1c5461]">Verifying your account...</p>}
        {!loading && success && (
          <p className="text-green-600 font-semibold">
            Your email has been verified! You may now{" "}
            <a href="/auth/login" className="underline text-[#1c5461]">
              Log in
            </a>
            .
          </p>
        )}
        {!loading && error && (
          <p className="text-red-600 font-semibold">{error}</p>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
