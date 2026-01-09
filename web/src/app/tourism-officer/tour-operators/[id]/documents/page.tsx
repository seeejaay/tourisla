"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDocumentManager } from "@/hooks/useDocumentManager";
import { useTourOperatorManager } from "@/hooks/useTourOperatorManager";
import { FileText, Loader2, Check, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentCard } from "@/components/custom/document/documentCard";

type OperatorDocument = {
  id: string;
  document_type: string;
  file_path?: string;
  upload_date?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED" | "REVOKED";
  note?: string;
};

const statusOptions = [
  { value: "", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "REVOKED", label: "Revoked" },
];

const documentTypes = [
  { value: "LETTER_OF_INTENT", label: "Letter of Intent", required: true },
  { value: "BUSINESS_PERMIT", label: "Business Permit", required: true },
  { value: "DTI_OR_SEC", label: "DTI/SEC Registration", required: true },
  { value: "BIR_CERTIFICATE", label: "BIR Certificate", required: true },
  { value: "PROOF_OF_OFFICE", label: "Proof of Office", required: true },
  { value: "BRGY_CLEARANCE", label: "Barangay Clearance", required: true },
  { value: "DOLE_REGISTRATION", label: "DOLE Registration", required: false },
  { value: "MANAGER_RESUME_ID", label: "Manager Resume/ID", required: false },
  {
    value: "MANAGER_PROOF_OF_EXPERIENCE",
    label: "Manager Proof of Experience",
    required: false,
  },
];

type TourOperator = {
  id?: string | number;
  operator_name?: string;
  email?: string;
  mobile_number?: string;
  office_address?: string;
  application_status?: string;
  profile_picture?: string;
};

export default function TourOperatorDocumentsApprovalPage() {
  const params = useParams();
  const router = useRouter();
  const operatorId = params?.id as string;
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("All");
  const [operator, setOperator] = useState<TourOperator | null>(null);
  const {
    fetchOperatorDocumentsById,
    approveOperatorDocument,
    rejectOperatorDocument,
    revokeTourOperatorDocument,
    fetchOperatorDocument,
  } = useDocumentManager();
  const { fetchApplicant, approveApplicant, rejectApplicant } =
    useTourOperatorManager();
  const [documents, setDocuments] = useState<OperatorDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    async function fetchOperatorData() {
      try {
        const op = await fetchApplicant(Number(operatorId));
        setOperator(op || null);
        if (!op) setError("Tour operator not found.");
      } catch (error) {
        setError("Failed to fetch operator info.");
        console.error("Error fetching operator data:", error);
      }
    }
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
        setError("Failed to load documents.");
        console.error("Error fetching documents:", error);
        setLoading(false);
      }
    }
    if (operatorId) {
      fetchOperatorData();
      fetchDocs();
    }
  }, [operatorId, fetchOperatorDocumentsById, fetchApplicant]);

  // Filter documents based on active tab
  const filteredDocuments =
    activeTab === "All"
      ? documents
      : documents.filter(
          (doc) => doc.status?.toLowerCase() === activeTab.toLowerCase()
        );

  // Calculate verification progress
  const requiredDocTypes = new Set(
    documentTypes.filter((doc) => doc.required).map((doc) => doc.value)
  );
  const verifiedDocTypes = new Set(
    documents
      .filter(
        (doc) =>
          doc.status === "APPROVED" && requiredDocTypes.has(doc.document_type)
      )
      .map((doc) => doc.document_type)
  );
  const requiredDocs = Array.from(requiredDocTypes);
  const verifiedDocs = verifiedDocTypes.size;
  const verificationPercentage = Math.round(
    (verifiedDocs / requiredDocs.length) * 100
  );

  // Approve, Reject, Revoke handlers
  const handleApprove = async (docId: string) => {
    try {
      const result = await approveOperatorDocument(docId);
      if (result) {
        const updatedDoc = await fetchOperatorDocument(docId);
        setDocuments((prev) =>
          prev.map((doc) => (doc.id === docId ? updatedDoc : doc))
        );
      }
    } catch (error) {
      setError(
        "Failed to approve document: " +
          (error instanceof Error ? error.message : String(error))
      );
      console.error("Error approving document:", error);
    }
  };

  const handleReject = async (docId: string, rejectionReason: string) => {
    try {
      const result = await rejectOperatorDocument(docId, rejectionReason);
      if (result) {
        const updatedDoc = await fetchOperatorDocument(docId);
        setDocuments((prev) =>
          prev.map((doc) => (doc.id === docId ? updatedDoc : doc))
        );
      }
    } catch (error) {
      setError(
        "Failed to reject document: " +
          (error instanceof Error ? error.message : String(error))
      );
      console.error("Error rejecting document:", error);
    }
  };

  const handleRevoke = async (docId: string, revocationReason: string) => {
    try {
      const result = await revokeTourOperatorDocument(docId, revocationReason);
      if (result) {
        const updatedDoc = await fetchOperatorDocument(docId);
        setDocuments((prev) =>
          prev.map((doc) => (doc.id === docId ? updatedDoc : doc))
        );
      }
    } catch (error) {
      setError(
        "Failed to revoke document: " +
          (error instanceof Error ? error.message : String(error))
      );
      console.error("Error revoking document:", error);
    }
  };

  const handleApproveOperator = async () => {
    if (
      !operator ||
      (typeof operator.id !== "string" && typeof operator.id !== "number")
    ) {
      return;
    }
    try {
      const result = await approveApplicant(Number(operatorId));
      setMessage("Tour operator approved successfully.");
      setAlertOpen(true);
      if (result) {
        // router.push("/tourism-officer/tour-operators");
      }
    } catch (error) {
      setError(
        "Failed to approve tour operator: " +
          (error instanceof Error ? error.message : String(error))
      );
      console.error("Error approving tour operator:", error);
    }
  };

  const handleRejectOperator = async () => {
    try {
      const result = await rejectApplicant(Number(operatorId));
      if (result) {
        setMessage("Tour operator rejected successfully.");
        setAlertOpen(true);
        router.push("/tourism-officer/tour-operators");
      }
    } catch (error) {
      setError(
        "Failed to reject tour operator: " +
          (error instanceof Error ? error.message : String(error))
      );
      console.error("Error rejecting tour operator:", error);
    }
  };

  return (
    <>
      <main className="min-h-screen w-full bg-gray-50 flex flex-col items-center py-8 px-4 sm:px-6">
        <div className="w-full max-w-6xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold text-[#1c5461] tracking-tight">
                Tour Operator
              </h1>
              <p className="text-[#3e979f] mt-2">
                Review and verify documents submitted by this tour operator
              </p>
            </div>

            {/* Operator Information */}
            {operator && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row items-center gap-6">
                {/* Avatar or Placeholder */}
                <div className="flex-shrink-0 w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                  <Image
                    src={
                      typeof operator.profile_picture === "string"
                        ? operator.profile_picture
                        : "/images/maleavatar.png"
                    }
                    alt={operator.operator_name || "Operator"}
                    width={96}
                    height={96}
                    className="object-contain"
                  />
                </div>
                {/* Info */}
                <div className="flex-1">
                  <h2 className="text-md lg:text-lg font-semibold text-gray-900 mb-2">
                    {operator.operator_name}
                  </h2>
                  <div className="flex justify-between gap-2">
                    <div>
                      <p className="text-gray-600 text-sm lg:text-md">
                        <span className="font-medium text-gray-800">
                          Email:
                        </span>{" "}
                        {operator.email}
                      </p>
                      <p className="text-gray-600 text-sm lg:text-md">
                        <span className="font-medium text-gray-800">
                          Phone:
                        </span>{" "}
                        {operator.mobile_number}
                      </p>
                      <p className="text-gray-600 text-sm lg:text-md">
                        <span className="font-medium text-gray-800">
                          Office:
                        </span>{" "}
                        {operator.office_address}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={handleApproveOperator}
                        className={`bg-green-100 text-green-600 hover:bg-green-200 cursor-pointer
                        ${
                          operator.application_status === "APPROVED"
                            ? "hidden"
                            : "block"
                        }
                      `}
                        disabled={verificationPercentage < 100}
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={handleRejectOperator}
                        className={`bg-red-100 text-red-600 hover:bg-red-200 cursor-pointer
                        ${
                          operator.application_status === "REJECTED"
                            ? "hidden"
                            : "block"
                        }
                      `}
                      >
                        {operator.application_status === "PENDING"
                          ? "Reject"
                          : "Disable"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`bg-[#3e979f] h-2.5 rounded-full  transition-all duration-300`}
                      style={{ width: `${verificationPercentage}%` }}
                    ></div>
                  </div>
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
                              : uploadedDoc.status === "REVOKED"
                              ? "bg-gray-100 text-gray-600"
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
                                    : uploadedDoc.status === "REVOKED"
                                    ? "secondary"
                                    : "secondary"
                                  : "destructive"
                              }
                              className={`text-xs w-24 ${
                                uploadedDoc
                                  ? uploadedDoc.status === "APPROVED"
                                    ? "bg-blue-100 text-blue-600"
                                    : uploadedDoc.status === "REJECTED"
                                    ? "bg-red-100 text-red-600"
                                    : uploadedDoc.status === "REVOKED"
                                    ? "bg-gray-100 text-gray-600"
                                    : "bg-yellow-100 text-yellow-600"
                                  : ""
                              }`}
                            >
                              {uploadedDoc
                                ? uploadedDoc.status === "APPROVED"
                                  ? "Verified"
                                  : uploadedDoc.status === "REJECTED"
                                  ? "Rejected"
                                  : uploadedDoc.status === "REVOKED"
                                  ? "Revoked"
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
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-5 gap-1 w-full bg-neutral-200/60 ">
                  {statusOptions.map((status) => (
                    <TabsTrigger
                      key={status.value}
                      value={status.label}
                      className="text-[#3e979f]  hover:bg-white hover:text-[#3e979f] focus:bg-[#e6f7fa] focus:text-[#3e979f] cursor-pointer"
                    >
                      {status.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              {/* Content based on loading state */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                  <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                  <p className="text-gray-600">Loading documents...</p>
                </div>
              ) : error || filteredDocuments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                  <FileText className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">
                    {activeTab === "all"
                      ? "No documents uploaded yet"
                      : `No ${activeTab} documents`}
                  </h3>
                  <p className="mt-1 text-gray-500 mb-6">
                    {activeTab === "all"
                      ? "This tour operator hasn't uploaded any documents yet."
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
                      <DocumentCard
                        key={doc.id}
                        docType={docType}
                        doc={doc}
                        onEnlarge={setEnlargedImage}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        onRevoke={handleRevoke}
                      />
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
      <Alert
        className={`fixed inset-0 z-50 flex items-center justify-center w-full h-full
          ${alertOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{ background: alertOpen ? "rgba(0,0,0,0.15)" : "transparent" }}
      >
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
          <AlertTitle className="text-lg font-semibold text-gray-900">
            {error ? "Error" : "Success"}
          </AlertTitle>
          <AlertDescription className="text-gray-600">
            {error || message || "Operation completed successfully."}
          </AlertDescription>
          <Button
            variant="outline"
            className="mt-2 cursor-pointer"
            onClick={() => setAlertOpen(false)}
          >
            Close
          </Button>
        </div>
      </Alert>
    </>
  );
}
