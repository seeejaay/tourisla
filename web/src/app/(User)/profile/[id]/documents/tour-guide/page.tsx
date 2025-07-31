"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDocumentManager } from "@/hooks/useDocumentManager";
import { useRouter } from "next/navigation";
import {
  FileText,
  Plus,
  AlertTriangle,
  Loader2,
  Pencil,
  Check,
  X,
  ChevronRight,
  UploadCloud,
} from "lucide-react";
import Image from "next/image";
import AddGuideDocument from "@/components/custom/document/addGuideDocument";
import EditGuideDocument from "@/components/custom/document/editGuideDocument";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type GuideDocument = {
  id: string;
  tourguide_id: string;
  document_type: string;
  file_path: string;
  requirements: string[];
  uploaded_at: string;
  status?: "pending" | "approved" | "rejected" | "revoked";
  note?: string;
};

export default function TourGuideDocumentsPage() {
  const router = useRouter();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<
    "add" | "edit" | "reason" | null
  >(null);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [documents, setDocuments] = useState<GuideDocument[]>([]);
  const [guideId, setGuideId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const { loggedInUser } = useAuth();
  const { fetchGuideDocumentsById } = useDocumentManager();

  useEffect(() => {
    async function fetchUserAndDocs() {
      setLoading(true);
      setError(null);
      try {
        const res = await loggedInUser(router);
        const userId = res.data.user.id;
        if (!userId) throw new Error("No tour guide ID found.");
        setGuideId(userId);

        const docs = await fetchGuideDocumentsById(userId);
        setDocuments(Array.isArray(docs) ? docs : []);
      } catch (error) {
        setError(
          (error instanceof Error ? error.message : String(error)) +
            " Failed to load documents."
        );
      } finally {
        setLoading(false);
      }
    }
    fetchUserAndDocs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSuccess = async () => {
    setDialogOpen(false);
    setDialogMode(null);
    setSelectedDocId(null);
    if (!guideId) return;
    setLoading(true);
    setError(null);
    try {
      const docs = await fetchGuideDocumentsById(guideId);
      setDocuments(Array.isArray(docs) ? docs : []);
    } catch (error) {
      setError(
        (error instanceof Error ? error.message : String(error)) +
          " Failed to load documents."
      );
    } finally {
      setLoading(false);
    }
  };

  const openAddDialog = () => {
    setDialogMode("add");
    setSelectedDocId(null);
    setDialogOpen(true);
  };
  const openEditDialog = (docId: string) => {
    setDialogMode("edit");
    setSelectedDocId(docId);
    setDialogOpen(true);
  };
  const openReasonDialog = (docId: string) => {
    setDialogMode("reason");
    setSelectedDocId(docId);
    setDialogOpen(true);
  };
  const statusOptions = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "revoked", label: "Revoked" },
  ];
  const documentChecklist = [
    { value: "GOV_ID", label: "Government ID", required: true },
    { value: "BIRTH_CERT", label: "Birth Certificate", required: true },
    { value: "NBI_CLEARANCE", label: "NBI Clearance", required: true },
    { value: "BRGY_CLEARANCE", label: "Barangay Clearance", required: true },
    { value: "MED_CERT", label: "Medical Certificate", required: true },
    { value: "RESUME", label: "Resume", required: true },
    { value: "PASSPORT_PHOTO", label: "Passport", required: false },
  ];
  const selectedDoc =
    dialogMode === "edit" && selectedDocId
      ? documents.find((d) => d.id === selectedDocId)
      : null;

  const requiredDocs = documentChecklist.filter((doc) => doc.required);

  // Get unique uploaded required document types
  const uploadedRequiredDocTypes = new Set(
    documents
      .filter((doc) =>
        requiredDocs.some((req) => req.value === doc.document_type)
      )
      .map((doc) => doc.document_type)
  );

  const completionPercentage = Math.round(
    (uploadedRequiredDocTypes.size / requiredDocs.length) * 100
  );

  // Filter documents based on active tab
  const filteredDocuments =
    activeTab === "all"
      ? documents
      : documents.filter(
          (doc) => doc.status?.toLowerCase() === activeTab.toLowerCase()
        );
  return (
    <main className="min-h-screen w-full bg-gray-50 flex flex-col items-center py-8 px-4 sm:px-6">
      <div className="w-full max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold text-[#1c5461] tracking-tight">
              Document Center
            </h1>
            <p className="text-[#3e979f] mt-2">
              Upload and manage your tour guide verification documents
            </p>
          </div>

          {/* Progress Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  Verification Progress
                </h2>
                <p className="text-gray-600 text-sm">
                  {uploadedRequiredDocTypes.size} of {requiredDocs.length}{" "}
                  required documents uploaded
                </p>
                <Progress
                  value={completionPercentage}
                  className="h-2 w-full sm:w-64"
                />
              </div>
              <Button
                className="gap-2 bg-[#3e979f] hover:bg-[#2c7a7f] text-white cursor-pointer"
                onClick={openAddDialog}
              >
                <Plus className="h-4 w-4" />
                Upload Document
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Checklist Panel */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Document Requirements
            </h2>
            <ul className="space-y-3">
              {documentChecklist.map((doc) => {
                const uploadedDoc = documents.find(
                  (d) => d.document_type === doc.value
                );
                return (
                  <li key={doc.value} className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex-shrink-0 rounded-full p-1 ${
                        uploadedDoc
                          ? uploadedDoc.status?.toLowerCase() === "approved"
                            ? "bg-blue-100 text-blue-600"
                            : uploadedDoc.status?.toLowerCase() ===
                                "rejected" ||
                              uploadedDoc.status?.toLowerCase() === "revoked"
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {uploadedDoc ? (
                        uploadedDoc.status?.toLowerCase() === "approved" ? (
                          <Check className="h-4 w-4" />
                        ) : uploadedDoc.status?.toLowerCase() === "rejected" ||
                          uploadedDoc.status?.toLowerCase() === "revoked" ? (
                          <X className="h-4 w-4 text-red-600" />
                        ) : (
                          <UploadCloud className="h-4 w-4" />
                        )
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm font-medium ${
                            uploadedDoc ? "text-gray-900" : "text-gray-600"
                          }`}
                        >
                          {doc.label}
                        </span>
                        {doc.required && (
                          <Badge
                            variant={
                              uploadedDoc
                                ? uploadedDoc.status?.toLowerCase() ===
                                  "approved"
                                  ? "default"
                                  : uploadedDoc.status?.toLowerCase() ===
                                      "rejected" ||
                                    uploadedDoc.status?.toLowerCase() ===
                                      "revoked"
                                  ? "destructive"
                                  : "secondary"
                                : "destructive"
                            }
                            className={`text-xs w-24
                            ${
                              uploadedDoc
                                ? uploadedDoc.status?.toLowerCase() ===
                                  "approved"
                                  ? "bg-blue-100 text-blue-800"
                                  : uploadedDoc.status?.toLowerCase() ===
                                    "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : uploadedDoc.status?.toLowerCase() ===
                                    "revoked"
                                  ? "bg-gray-100 text-gray-600"
                                  : "bg-green-700 text-white"
                                : "bg-red-700 text-white"
                            }
                          `}
                          >
                            {uploadedDoc
                              ? uploadedDoc.status?.toLowerCase() === "approved"
                                ? "Verified"
                                : uploadedDoc.status?.toLowerCase() ===
                                  "rejected"
                                ? "Rejected"
                                : uploadedDoc.status?.toLowerCase() ===
                                  "revoked"
                                ? "Revoked"
                                : "Uploaded"
                              : "Required"}
                          </Badge>
                        )}
                      </div>

                      {(uploadedDoc?.status?.toLowerCase() === "rejected" ||
                        uploadedDoc?.status?.toLowerCase() === "revoked") && (
                        <button
                          onClick={() => openReasonDialog(uploadedDoc.id)}
                          className="text-xs text-blue-600 hover:text-blue-800 mt-1 flex items-center cursor-pointer"
                        >
                          View details <ChevronRight className="h-3 w-3 ml-1" />
                        </button>
                      )}
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
              <TabsList className="grid grid-cols-5 w-full">
                {statusOptions.map((status) => (
                  <TabsTrigger
                    key={status.value}
                    value={status.value}
                    className="cursor-pointer"
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
                <p className="text-gray-600">Loading your documents...</p>
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
                    ? "Get started by uploading your first document"
                    : `You don't have any ${activeTab} documents`}
                </p>
                {activeTab === "all" && (
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={openAddDialog}
                  >
                    Upload Document
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDocuments.map((doc) => {
                  const docType =
                    documentChecklist.find((d) => d.value === doc.document_type)
                      ?.label || doc.document_type;
                  return (
                    <Card
                      key={doc.id}
                      className="transition-all duration-200 hover:shadow-md py-[21px] border-gray-200 rounded-xl overflow-hidden"
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
                              className={`text-xs capitalize
                                ${
                                  doc.status.toLowerCase() === "approved"
                                    ? "bg-blue-100 text-blue-800"
                                    : doc.status.toLowerCase() === "rejected"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                            >
                              {doc.status.toLowerCase() === "approved"
                                ? "Verified"
                                : doc.status.toLowerCase() === "rejected"
                                ? "Rejected"
                                : "Pending"}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          Uploaded:{" "}
                          {new Date(doc.uploaded_at).toLocaleDateString()}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                          {doc.file_path ? (
                            <button
                              type="button"
                              className="absolute inset-0 w-full h-full focus:outline-none"
                              onClick={() => setEnlargedImage(doc.file_path)}
                            >
                              <Image
                                src={doc.file_path}
                                alt={docType}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0  bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
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
                        <div className="pt-2 ">
                          {(doc.status?.toLowerCase() === "pending" ||
                            doc.status?.toLowerCase() === "rejected") && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(doc.id)}
                              className="gap-2"
                            >
                              <Pencil className="h-4 w-4" />
                              Edit
                            </Button>
                          )}
                        </div>
                      </CardContent>
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
                {/* Show document type label below the header */}
                {enlargedImage && (
                  <span className="mt-2 block text-sm text-gray-700 font-mono">
                    {documentChecklist.find(
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

        {/* Dialog for Add/Edit */}
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setDialogMode(null);
              setSelectedDocId(null);
            }
          }}
        >
          <DialogContent className="sm:max-w-[600px] rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                {dialogMode === "add" ? "Upload New Document" : "Edit Document"}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                {dialogMode === "add"
                  ? "Submit required documents for verification"
                  : "Update your document information"}
              </DialogDescription>
            </DialogHeader>
            {dialogMode === "add" && (
              <AddGuideDocument
                guideId={guideId}
                onSuccess={handleSuccess}
                onCancel={() => setDialogOpen(false)}
              />
            )}
            {dialogMode === "edit" &&
              selectedDocId &&
              (selectedDoc ? (
                <EditGuideDocument
                  docuId={selectedDocId}
                  initialData={{
                    document_type: selectedDoc.document_type,
                    requirements: selectedDoc.requirements || [],
                    file_path: selectedDoc.file_path,
                  }}
                  onSuccess={handleSuccess}
                  onCancel={() => setDialogOpen(false)}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Loading document details...
                </div>
              ))}
          </DialogContent>
        </Dialog>

        {/* Dialog for Reason */}
        <Dialog
          open={dialogMode === "reason" && selectedDocId !== null}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setDialogMode(null);
              setSelectedDocId(null);
            }
          }}
        >
          <DialogContent className="sm:max-w-[600px] rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Reason for{" "}
                {documents.find((d) => d.id === selectedDocId)?.status ===
                "revoked"
                  ? "Revocation"
                  : "Rejection"}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                {documents.find((d) => d.id === selectedDocId)?.status ===
                "revoked"
                  ? "This document was revoked for the following reason:"
                  : "This document was rejected for the following reason:"}
              </DialogDescription>
            </DialogHeader>
            <div className="p-6">
              <div className="bg-gray-100 rounded-lg p-4 text-gray-800 text-base">
                {documents.find((d) => d.id === selectedDocId)?.note ||
                  "No reason provided."}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
