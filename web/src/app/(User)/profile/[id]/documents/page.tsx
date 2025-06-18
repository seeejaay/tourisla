"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDocumentManager } from "@/hooks/useDocumentManager";
import { useRouter } from "next/navigation";

import AddGuideDocument from "@/components/custom/document/addGuideDocument";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

export default function TourGuideDocumentsPage() {
  const router = useRouter();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [guideId, setGuideId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { loggedInUser } = useAuth();
  const { fetchGuideDocumentsById } = useDocumentManager();

  // Fetch guideId and documents
  useEffect(() => {
    async function fetchUserAndDocs() {
      setLoading(true);
      setError(null);
      try {
        // Get the current user
        const res = await loggedInUser(router);
        const userId = res.data.user.user_id;
        if (!userId) throw new Error("No tour guide ID found.");
        setGuideId(userId);

        // Fetch documents for this guide
        const docs = await fetchGuideDocumentsById(userId);
        setDocuments(Array.isArray(docs) ? docs : []);
      } catch (error) {
        setError(error + " Failed to load documents.");
      } finally {
        setLoading(false);
      }
    }
    fetchUserAndDocs();
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch documents after adding a new one
  const handleSuccess = async () => {
    setDialogOpen(false);
    if (!guideId) return;
    setLoading(true);
    setError(null);
    try {
      const docs = await fetchGuideDocumentsById(guideId);
      setDocuments(Array.isArray(docs) ? docs : []);
    } catch (error) {
      setError(error + " Failed to load documents.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <h1>Your Uploaded Documents</h1>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button>Add Document</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Tour Guide Document</DialogTitle>
            <DialogDescription>
              Fill in the details to upload a new document.
            </DialogDescription>
          </DialogHeader>
          <AddGuideDocument
            guideId={guideId}
            onSuccess={handleSuccess}
            onCancel={() => setDialogOpen(false)}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {loading ? (
        <div>Loading documents...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : documents.length === 0 ? (
        <div>No documents uploaded yet.</div>
      ) : (
        <ul>
          {documents.map((doc) => (
            <li key={doc.id}>
              <strong>{doc.document_type}</strong>
              {doc.file_path && (
                <>
                  {" - "}
                  <a
                    href={doc.file_path}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View File
                  </a>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
