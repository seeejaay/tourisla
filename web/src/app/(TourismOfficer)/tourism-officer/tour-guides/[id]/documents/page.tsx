"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDocumentManager } from "@/hooks/useDocumentManager";
import { FileText, AlertTriangle, Loader2, Check, X } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type GuideDocument = {
  id: string;
  document_type: string;
  file_path?: string;
  uploaded_at?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  tourguide_id?: string;
};

const documentTypes = [
  { value: "GOV_ID", label: "Government ID", required: true },
  { value: "BIRTH_CERT", label: "Birth Certificate", required: true },
  { value: "NBI_CLEARANCE", label: "NBI Clearance", required: true },
  { value: "BRGY_CLEARANCE", label: "Barangay Clearance", required: true },
  { value: "MED_CERT", label: "Medical Certificate", required: true },
  { value: "RESUME", label: "Resume", required: true },
  { value: "PASSPORT_PHOTO", label: "Passport Photo", required: false },
];

export default function TourGuideDocumentsApprovalPage() {
  const params = useParams();
  const router = useRouter();
  const guideId = params?.id as string;
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const { fetchGuideDocumentsById, approveGuideDocument, rejectGuideDocument } =
    useDocumentManager();
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
        setError(
          "Failed to load documents: " +
            (error instanceof Error ? error.message : String(error))
        );
        setLoading(false);
      }
    }
    if (guideId) fetchDocs();
  }, [guideId, fetchGuideDocumentsById]);

  const handleApprove = async (docId: string) => {
    try {
      const result = await approveGuideDocument(docId);
      if (result) {
        toast.success("Document approved successfully.");
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === docId ? { ...doc, status: "APPROVED" } : doc
          )
        );
      } else {
        toast.error("Failed to approve document.");
      }
    } catch (error) {
      toast.error(
        "Error approving document: " +
          (error instanceof Error ? error.message : String(error))
      );
    }
  };

  const handleReject = async (docId: string) => {
    try {
      const result = await rejectGuideDocument(docId);
      if (result) {
        toast.success("Document rejected successfully.");
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === docId ? { ...doc, status: "REJECTED" } : doc
          )
        );
      } else {
        toast.error("Failed to reject document.");
      }
    } catch (error) {
      toast.error(
        "Error rejecting document: " +
          (error instanceof Error ? error.message : String(error))
      );
    }
  };

  // Filter documents based on active tab
  const filteredDocuments =
    activeTab === "all"
      ? documents
      : documents.filter(
          (doc) => doc.status?.toLowerCase() === activeTab.toLowerCase()
        );

  // Calculate verification progress
  const requiredDocs = documentTypes.filter((doc) => doc.required);
  const verifiedDocs = documents.filter(
    (doc) =>
      doc.status === "APPROVED" &&
      requiredDocs.some((req) => req.value === doc.document_type)
  ).length;
  const verificationPercentage = Math.round(
    (verifiedDocs / requiredDocs.length) * 100
  );

  return (
    <main className="min-h-screen w-full bg-gray-50 flex flex-col items-center py-8 px-4 sm:px-6">
      <div className="w-full max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold text-[#1c5461] tracking-tight">
              Tour Guide Documents Review
            </h1>
            <p className="text-[#3e979f] mt-2">
              Review and verify documents submitted by this tour guide
            </p>
          </div>

          {/* Verification Progress */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-gray-900">
                Verification Status
              </h2>
              <p className="text-gray-600 text-sm">
                {verifiedDocs} of {requiredDocs.length} required documents
                verified
              </p>
              <div className="flex justify-between items-center">
                <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`bg-black h-2.5 rounded-full  transition-all duration-300`}
                    style={{ width: `${verificationPercentage}%` }}
                  ></div>
                </div>
                <Button
                  onClick={() => router.push(`/tourism-officer/tour-guides`)}
                  variant="outline"
                  className="text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  All Tour Guides
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Checklist Panel */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Document Checklist
            </h2>
            <ul className="space-y-3">
              {documentTypes.map((doc) => {
                const uploadedDoc = documents.find(
                  (d) => d.document_type === doc.value
                );
                return (
                  <li key={doc.value} className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex-shrink-0 rounded-full p-1 ${
                        uploadedDoc
                          ? uploadedDoc.status === "APPROVED"
                            ? "bg-green-100 text-green-600"
                            : uploadedDoc.status === "REJECTED"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {uploadedDoc ? (
                        uploadedDoc.status === "APPROVED" ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <X className="h-4 w-4" />
                        )
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm font-medium ${
                            uploadedDoc
                              ? uploadedDoc.status === "APPROVED"
                                ? "text-gray-900"
                                : "text-gray-600"
                              : "text-gray-600"
                          }`}
                        >
                          {doc.label}
                        </span>
                        {doc.required && (
                          <Badge
                            variant={
                              uploadedDoc
                                ? uploadedDoc.status === "APPROVED"
                                  ? "default"
                                  : uploadedDoc.status === "REJECTED"
                                  ? "destructive"
                                  : "secondary"
                                : "destructive"
                            }
                            className={`text-xs w-24 ${
                              uploadedDoc
                                ? uploadedDoc.status === "APPROVED"
                                  ? "bg-blue-100 text-blue-600"
                                  : uploadedDoc.status === "REJECTED"
                                  ? "bg-red-100 text-red-600"
                                  : "bg-yellow-100 text-yellow-600"
                                : ""
                            }`}
                          >
                            {uploadedDoc
                              ? uploadedDoc.status === "APPROVED"
                                ? "Verified"
                                : uploadedDoc.status === "REJECTED"
                                ? "Rejected"
                                : "Pending"
                              : "Required"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Documents Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs for document filtering */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Content based on loading state */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                <p className="text-gray-600">Loading documents...</p>
              </div>
            ) : error ? (
              <div className="rounded-xl bg-red-50 p-6 text-center border border-red-200">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-red-800">
                  Loading Error
                </h3>
                <p className="mt-2 text-red-600">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="mt-4 border-red-300 text-red-700 hover:bg-red-50"
                >
                  Retry
                </Button>
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  {activeTab === "all"
                    ? "No documents uploaded yet"
                    : `No ${activeTab} documents`}
                </h3>
                <p className="mt-1 text-gray-500 mb-6">
                  {activeTab === "all"
                    ? "This tour guide hasn't uploaded any documents yet."
                    : `There are no ${activeTab} documents`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDocuments.map((doc) => {
                  const docType =
                    documentTypes.find((d) => d.value === doc.document_type)
                      ?.label || doc.document_type;
                  return (
                    <Card
                      key={doc.id}
                      className="transition-all duration-200 hover:shadow-md border-gray-200 rounded-xl overflow-hidden"
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-gray-900 line-clamp-1">
                            {docType}
                          </h3>
                          {doc.status && (
                            <Badge
                              variant={
                                doc.status.toLowerCase() === "approved"
                                  ? "default"
                                  : doc.status.toLowerCase() === "rejected"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className={`text-xs capitalize ${
                                doc.status === "PENDING"
                                  ? "text-yellow-600 bg-yellow-100"
                                  : doc.status === "APPROVED"
                                  ? "text-blue-600 bg-blue-100"
                                  : "text-red-600 bg-red-100"
                              }`}
                            >
                              {doc.status.toLowerCase() === "pending"
                                ? "Pending"
                                : doc.status.toLowerCase() === "approved"
                                ? "Verified"
                                : "Rejected"}
                            </Badge>
                          )}
                        </div>
                        {doc.uploaded_at && (
                          <p className="text-xs text-gray-500">
                            Uploaded:{" "}
                            {new Date(doc.uploaded_at).toLocaleDateString()}
                          </p>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                          {doc.file_path ? (
                            <button
                              type="button"
                              className="absolute inset-0 w-full h-full focus:outline-none"
                              onClick={() =>
                                doc.file_path && setEnlargedImage(doc.file_path)
                              }
                            >
                              <Image
                                src={doc.file_path!}
                                alt={docType}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0  hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                                <span className="bg-[#3e979f] bg-opacity-80 text-xs font-medium px-2 py-1 rounded-md shadow-sm text-white">
                                  Click to enlarge
                                </span>
                              </div>
                            </button>
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                              No preview available
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center px-4 pb-4">
                        {doc.status === "PENDING" ? (
                          <>
                            <Button
                              variant="outline"
                              className="text-green-600 border-green-300 hover:bg-green-50"
                              onClick={() => handleApprove(doc.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              className="text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleReject(doc.id)}
                            >
                              Reject
                            </Button>
                          </>
                        ) : (
                          <div className="w-full text-center text-sm text-gray-500">
                            {doc.status === "APPROVED"
                              ? "This document has been approved"
                              : "This document has been rejected"}
                          </div>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Image Enlarged Modal */}
        <Dialog
          open={!!enlargedImage}
          onOpenChange={() => setEnlargedImage(null)}
        >
          <DialogContent className="lg:max-w-[900px] w-full bg-white border-none p-0 rounded-lg">
            <DialogHeader className="px-6 pt-6">
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Document Preview
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                {enlargedImage && (
                  <span className="mt-2 block text-sm text-gray-700">
                    {documentTypes.find(
                      (doc) =>
                        doc.value ===
                        documents.find((d) => d.file_path === enlargedImage)
                          ?.document_type
                    )?.label || "Document Preview"}
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            {enlargedImage && (
              <div className="flex items-center justify-center px-6 pb-6">
                <Image
                  src={enlargedImage}
                  alt="Enlarged Document"
                  width={1200}
                  height={900}
                  className="max-h-[70vh] max-w-full object-contain rounded-lg"
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
