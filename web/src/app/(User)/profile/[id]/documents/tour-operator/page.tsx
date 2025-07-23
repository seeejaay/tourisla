"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDocumentManager } from "@/hooks/useDocumentManager";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FileText,
  FileDown,
  Plus,
  AlertTriangle,
  Loader2,
  Pencil,
  Check,
  X,
  ChevronRight,
} from "lucide-react";

import AddOperatorDocument from "@/components/custom/document/addOperatorDocument";
import EditOperatorDocument from "@/components/custom/document/editOperatorDocument";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

type OperatorDocument = {
  id: string;
  tourguide_id: string;
  document_type: string;
  file_path: string;
  requirements: string[];
  uploaded_at: string;
  status?: "pending" | "approved" | "rejected";
};

const operatorChecklist = [
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

export default function TourOperatorDocumentsPage() {
  const router = useRouter();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit" | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [documents, setDocuments] = useState<OperatorDocument[]>([]);
  const [operatorId, setOperatorId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const { loggedInUser } = useAuth();
  const { fetchOperatorDocumentsById } = useDocumentManager();

  useEffect(() => {
    async function fetchUserAndDocs() {
      setLoading(true);
      setError(null);
      try {
        const res = await loggedInUser(router);
        const userId = res.data.user.user_id;
        if (!userId) throw new Error("No operator ID found.");
        setOperatorId(userId);

        const docs = await fetchOperatorDocumentsById(userId);
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
    if (!operatorId) return;
    setLoading(true);
    setError(null);
    try {
      const docs = await fetchOperatorDocumentsById(operatorId);
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

  // Open dialog for add or edit
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

  // Find the selected document for editing
  const selectedDoc =
    dialogMode === "edit" && selectedDocId
      ? documents.find((d) => d.id === selectedDocId)
      : null;

  // Progress calculation
  const requiredDocs = operatorChecklist.filter((doc) => doc.required);
  const uploadedRequiredDocs = requiredDocs.filter((req) =>
    documents.some((doc) => doc.document_type === req.value)
  ).length;
  const completionPercentage = Math.round(
    (uploadedRequiredDocs / requiredDocs.length) * 100
  );

  // Filter documents by tab
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#1c5461] tracking-tight">
                My Operator Documents
              </h1>
              <p className="text-[#3e979f] mt-2">
                Manage your tour operator verification documents
              </p>
            </div>
          </div>

          {/* Progress Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  Verification Progress
                </h2>
                <p className="text-gray-600 text-sm">
                  {uploadedRequiredDocs} of {requiredDocs.length} required
                  documents uploaded
                </p>
                <Progress
                  value={completionPercentage}
                  className="h-2 w-full sm:w-64"
                />
                <span className="text-xs text-gray-500 mt-1 block">
                  {completionPercentage}% complete
                </span>
              </div>
              <Button
                className="gap-2 bg-[#3e979f] hover:bg-[#2c7a7f] text-white"
                onClick={openAddDialog}
              >
                <Plus className="h-4 w-4" />
                Add Document
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
              {operatorChecklist.map((doc) => {
                const uploadedDoc = documents.find(
                  (d) => d.document_type === doc.value
                );
                return (
                  <li key={doc.value} className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex-shrink-0 rounded-full p-1 ${
                        uploadedDoc
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {uploadedDoc ? (
                        <Check className="h-4 w-4" />
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
                            variant={uploadedDoc ? "default" : "destructive"}
                            className={`text-xs w-24 ${
                              uploadedDoc ? "bg-green-700" : "bg-red-700"
                            }`}
                          >
                            {uploadedDoc ? "Uploaded" : "Required"}
                          </Badge>
                        )}
                      </div>
                      {uploadedDoc && (
                        <button
                          onClick={() => openEditDialog(uploadedDoc.id)}
                          className="text-xs text-blue-600 hover:text-blue-800 mt-1 flex items-center"
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
                    className="bg-[#3e979f] hover:bg-[#2c7a7f] text-white"
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
                    operatorChecklist.find((d) => d.value === doc.document_type)
                      ?.label || doc.document_type;
                  const isImage = doc.file_path?.match(
                    /\.(jpg|jpeg|png|gif|bmp|webp)$/i
                  );
                  const fileName = doc.file_path?.split("/").pop();

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
                            isImage ? (
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
                                <div className="absolute inset-0 bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                                  <span className="bg-[#3e979f] bg-opacity-80 text-xs font-medium px-2 py-1 rounded-md shadow-sm text-white">
                                    Click to enlarge
                                  </span>
                                </div>
                              </button>
                            ) : (
                              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
                                <FileText className="h-12 w-12 text-blue-400" />
                                <span className="text-sm font-medium text-gray-700 text-center break-all">
                                  {fileName}
                                </span>
                                <a
                                  href={doc.file_path}
                                  download
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
                                >
                                  <FileDown className="h-4 w-4" />
                                  Download
                                </a>
                              </div>
                            )
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                              No preview available
                            </div>
                          )}
                        </div>
                        <div className="pt-4">
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
                {enlargedImage && (
                  <span className="mt-2 block text-sm text-gray-700 font-mono">
                    {operatorChecklist.find(
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
              <AddOperatorDocument
                operatorId={operatorId}
                onSuccess={handleSuccess}
                onCancel={() => setDialogOpen(false)}
              />
            )}
            {dialogMode === "edit" &&
              selectedDocId &&
              (selectedDoc ? (
                <EditOperatorDocument
                  docuId={selectedDocId}
                  initialData={{
                    document_type: selectedDoc.document_type,
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
      </div>
    </main>
  );
}
