"use client";

import React, { useEffect, useState } from "react";
// import Header from "@/components/custom/header";
import { useIslandEntryManager } from "@/hooks/useIslandEntryManager";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type IslandEntry = {
  unique_code: string;
  qr_code_url: string;
  name: string;
  created_at: string;
  status: string;
  // Add other fields as needed
};

export default function IslandEntryQRPage() {
  const { getLatestEntry, loading } = useIslandEntryManager();
  const [entry, setEntry] = useState<IslandEntry | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchLatest() {
      setError("");
      const res = await getLatestEntry();
      if (!res || !res.unique_code) {
        setError("No recent island entry found.");
        setEntry(null);
        return;
      }
      setEntry(res);
    }
    fetchLatest();
  }, [getLatestEntry]);

  const handlePrintCard = () => {
    const printContents = document.getElementById("print-card")?.innerHTML;
    if (!printContents) return;
    const win = window.open("", "PrintWindow");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Print QR Code</title>
          <style>
            body { background: #e6f7fa; }
            .print-card { 
              margin: 0 auto; 
              padding: 32px; 
              border-radius: 16px; 
              box-shadow: 0 2px 16px #0002; 
              background: #fff;
              width: 350px;
              text-align: center;
              font-family: sans-serif;
            }
            .print-card img { margin: 16px auto; }
            .print-card .code { font-size: 2rem; color: #51702c; letter-spacing: 0.2em; font-weight: bold; }
            .print-card h1 { color: #1c5461; }
            .print-card p { color: #51702c; }
            @media print {
              body { background: #e6f7fa; }
            }
          </style>
        </head>
        <body>
          <div class="print-card">
            ${printContents}
          </div>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-[#e6f7fa] via-[#f0f0f0] to-[#b6e0e4] flex flex-col items-center justify-start px-4 pt-24 pb-20">
        <main className="w-full max-w-md pt-16">
          <div
            id="print-card"
            className="p-8 shadow-lg border border-[#e6f7fa] bg-white rounded-2xl space-y-8 flex flex-col items-center"
          >
            <h1 className="text-3xl font-extrabold text-[#1c5461] text-center mb-2">
              Island Entry QR Code
            </h1>
            <p className="text-center text-[#51702c]">
              This is your most recent island entry QR code. Show this at the
              entry point.
            </p>
            {loading ? (
              <div className="text-center text-[#1c5461]">Loading...</div>
            ) : error ? (
              <div className="text-red-500 text-center">{error}</div>
            ) : entry ? (
              <>
                <Image
                  src={entry.qr_code_url}
                  alt="Island Entry QR"
                  width={160}
                  height={160}
                  className="w-48 h-48 border-4 border-[#3e979f] rounded-xl bg-white mx-auto"
                />
                <div className=" text-center">
                  <div className="font-bold text-lg text-[#1c5461]">
                    {entry.name}
                  </div>
                  <div className="code text-3xl text-center text-[#51702c] tracking-widest">
                    <span className="font-bold">{entry.unique_code}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-[#1c5461]">
                No QR code available.
              </div>
            )}
            <Button
              className="w-full rounded-lg bg-[#3e979f] text-white hover:bg-[#1c5461] transition"
              onClick={handlePrintCard}
            >
              Print QR Code
            </Button>
          </div>
        </main>
      </div>
    </>
  );
}
