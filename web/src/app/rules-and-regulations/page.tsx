"use client";

import React, { useEffect } from "react";
import { useRuleManager } from "@/hooks/useRuleManager";
import { Loader2, AlertTriangle } from "lucide-react";
import Header from "@/components/custom/header";
import Footer from "@/components/custom/footer";
export default function RulesAndRegulationPage() {
  const { rules, loading, error, fetchRules } = useRuleManager();

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  return (
    <>
      <Header />
      <main className="min-h-screen w-full pt-28 bg-gradient-to-b from-[#e6f7fa] to-white flex flex-col items-center py-12 px-2">
        <div className="w-full max-w-3xl mx-auto space-y-8">
          <h1 className="text-3xl font-extrabold text-[#1c5461] tracking-tight mb-4">
            Rules and Regulations
          </h1>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
              <p className="text-gray-600">Loading rules...</p>
            </div>
          ) : error ? (
            <div className="rounded-xl bg-red-50 p-6 text-center border border-red-100 max-w-md mx-auto">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-red-800">
                Loading Error
              </h3>
              <p className="mt-2 text-red-600">{error}</p>
            </div>
          ) : !rules || rules.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 max-w-md mx-auto">
              <h3 className="text-lg font-medium text-gray-900">
                No rules found
              </h3>
              <p className="mt-1 text-gray-500 mb-6">
                There are currently no rules and regulations available.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="bg-white border border-[#e6f7fa] rounded-xl shadow p-5"
                >
                  <h2 className="text-xl font-bold text-[#1c5461] mb-2">
                    {rule.title}
                  </h2>
                  <p className="text-gray-700 whitespace-pre-line">
                    {rule.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
