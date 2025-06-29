"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDocumentManager } from "@/hooks/useDocumentManager";
import { useRouter } from "next/navigation";
import { FileText, Plus, AlertTriangle, Loader2, Pencil } from "lucide-react";

import AddGuideDocument from "@/components/custom/document/addGuideDocument";
import EditGuideDocument from "@/components/custom/document/editGuideDocument";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

type GuideDocument = {
  id: string;
  tourguide_id: string;
  document_type: string;
  file_path: string;
  requirements: string[];
  uploaded_at: string;
};

export default function TourGuideDocumentsPage() {
  const router = useRouter();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit" | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  const [documents, setDocuments] = useState<GuideDocument[]>([]);
  const [guideId, setGuideId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { loggedInUser } = useAuth();
  const { fetchGuideDocumentsById } = useDocumentManager();

  useEffect(() => {
    async function fetchUserAndDocs() {
      setLoading(true);
      setError(null);
      try {
        const res = await loggedInUser(router);
        const userId = res.data.user.user_id;
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

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-[#e6f7fa] to-white flex flex-col items-center py-12 px-2">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1c5461] tracking-tight">
              My Documents
            </h1>
            <p className="text-[#51702c] mt-2">
              Manage your tour guide verification documents
            </p>
          </div>
          <Button
            className="gap-2 bg-[#3e979f] hover:bg-[#1c5461] text-white"
            onClick={openAddDialog}
          >
            <Plus className="h-4 w-4" />
            Add Document
          </Button>
        </div>

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
          <DialogContent className="sm:max-w-[600px] rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">
                {dialogMode === "add" ? "Upload New Document" : "Edit Document"}
              </DialogTitle>
              <DialogDescription>
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
                <div className="text-center py-8">Loading document...</div>
              ))}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Content Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <p className="text-gray-600">Loading your documents...</p>
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
              Get started by uploading your first document
            </p>
            <Button
              className="bg-[#3e979f] hover:bg-[#1c5461] text-white"
              onClick={openAddDialog}
            >
              Upload Document
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8 w-full">
            {documents.map((doc) => (
              <Card
                key={doc.id}
                className="transition-shadow duration-200 w-[300px] bg-white border border-[#e6f7fa] rounded-2xl shadow-md hover:shadow-xl m-2 flex flex-col"
              >
                <CardHeader>
                  <h3 className="font-bold capitalize text-[#1c5461]">
                    {doc.document_type.replace(/_/g, " ")}
                  </h3>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center">
                  {doc.file_path ? (
                    <div className="flex justify-center w-full">
                      <img
                        src={doc.file_path}
                        alt={doc.document_type}
                        className="object-cover w-full h-48 rounded-lg border border-[#e6f7fa] bg-gray-50"
                      />
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">
                      No file uploaded
                    </span>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between items-center px-4 pb-4">
                  <span className="text-xs text-gray-500">
                    {doc.uploaded_at
                      ? new Date(doc.uploaded_at).toLocaleDateString()
                      : ""}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      className="gap-2 border-[#3e979f] text-[#1c5461]"
                      variant="outline"
                      onClick={() => openEditDialog(doc.id)}
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
