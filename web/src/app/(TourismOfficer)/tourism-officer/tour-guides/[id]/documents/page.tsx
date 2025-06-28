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
type GuideDocument = {
  id?: string | number;
  document_type: string;
  file_path?: string;
  upload_date?: string;
};

export default function TourGuideDocumentsPage() {
  const params = useParams();
  const guideId = params?.id as string;

  const { fetchGuideDocumentsById } = useDocumentManager();
  const [documents, setDocuments] = useState<GuideDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDocs() {
      setLoading(true);
      setError(null);
      try {
        const docs = await fetchGuideDocumentsById(guideId);
        setDocuments(Array.isArray(docs) ? docs : []);
        if (!docs || docs.length === 0) {
          setError("No documents found for this tour guide.");
        }
        setLoading(false);
      } catch (error) {
        setError("Failed to load documents." + error);
      } finally {
        setLoading(false);
      }
    }
    if (guideId) fetchDocs();
  }, [guideId, fetchGuideDocumentsById]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center py-12 px-4 sm:px-6 w-full">
      <div className="w-full pl-24 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Tour Guide Documents
            </h1>
            <p className="text-gray-500 mt-2">
              View the verification documents submitted by this tour guide.
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
          <div className="rounded-xl bg-red-50 p-6 text-center border border-red-100">
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
          <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No documents uploaded
            </h3>
            <p className="mt-1 text-gray-500 mb-6">
              This tour guide has not uploaded any documents yet.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6 w-full ">
            {documents.map((doc) => (
              <Card
                key={doc.id}
                className="hover:shadow-md transition-shadow duration-200 w-[300px] bg-white border border-gray-200 rounded-lg shadow-sm m-2 flex flex-col"
              >
                <CardHeader>
                  <h3 className="font-medium capitalize">
                    {doc.document_type.replace(/_/g, " ")}
                  </h3>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center">
                  {doc.file_path ? (
                    <div className="flex justify-center w-full">
                      <Image
                        width={300}
                        height={300}
                        src={doc.file_path}
                        alt={doc.document_type}
                        className="object-contain w-full h-full"
                      />
                    </div>
                  ) : (
                    <span className="text-gray-400">No file uploaded</span>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
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
    </div>
  );
}
