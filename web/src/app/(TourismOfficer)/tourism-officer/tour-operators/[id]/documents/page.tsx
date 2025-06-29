"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDocumentManager } from "@/hooks/useDocumentManager";
import { FileText, AlertTriangle, Loader2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type OperatorDocument = {
  id?: string | number;
  document_type: string;
  file_path?: string;
  upload_date?: string;
};

export default function TourOperatorDocumentsPage() {
  const params = useParams();
  const operatorId = params?.id as string;

  const { fetchOperatorDocumentsById } = useDocumentManager();
  const [documents, setDocuments] = useState<OperatorDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDocs() {
      setLoading(true);
      setError(null);
      try {
        const docs = await fetchOperatorDocumentsById(operatorId);
        setDocuments(Array.isArray(docs) ? docs : []);
        if (!docs || docs.length === 0) {
          setError("No documents found for this tour operator.");
        }
        setLoading(false);
      } catch (error) {
        setError("Failed to load documents." + error);
        setLoading(false);
      }
    }
    if (operatorId) fetchDocs();
  }, [operatorId, fetchOperatorDocumentsById]);

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-[#e6f7fa] to-white flex flex-col items-center py-12 px-2">
      <div className="w-full max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1c5461] tracking-tight">
              Tour Operator Documents
            </h1>
            <p className="text-[#51702c] mt-2">
              View the verification documents submitted by this tour operator.
            </p>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <p className="text-gray-600">Loading documents...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl bg-red-50 p-6 text-center border border-red-100 max-w-md mx-auto">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-red-800">Loading Error</h3>
            <p className="mt-2 text-red-600">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="mt-4 border-red-300 text-red-700 hover:bg-red-50"
            >
              Retry
            </Button>
          </div>
        ) : documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 max-w-md mx-auto">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No documents uploaded
            </h3>
            <p className="mt-1 text-gray-500 mb-6">
              This tour operator has not uploaded any documents yet.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8 w-full">
            {documents.map((doc) => (
              <Card
                key={doc.id}
                className="transition-shadow duration-200 w-[340px] bg-white border border-[#e6f7fa] rounded-2xl shadow-md hover:shadow-xl m-2 flex flex-col"
              >
                <CardHeader className="pb-2">
                  <h3 className="font-bold capitalize text-[#1c5461] text-lg tracking-wide">
                    {doc.document_type.replace(/_/g, " ")}
                  </h3>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center py-2">
                  {doc.file_path ? (
                    <div className="flex justify-center w-full">
                      <Image
                        width={300}
                        height={220}
                        src={doc.file_path}
                        alt={doc.document_type}
                        className="object-cover w-full h-56 rounded-lg border border-[#e6f7fa] bg-gray-50"
                      />
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">
                      No file uploaded
                    </span>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end items-center px-4 pb-4">
                  <span className="text-xs text-gray-500">
                    {doc.upload_date
                      ? new Date(doc.upload_date).toLocaleDateString()
                      : ""}
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}