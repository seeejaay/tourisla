"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDocumentManager } from "@/hooks/useDocumentManager";

export default function TourGuideDocumentsPage() {
  const { loading: authLoading, error: authError } = useAuth();
  const {
    loading: docLoading,
    error: docError,
    fetchGuideDocumentsById,
  } = useDocumentManager();

  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDocs() {
      setLoading(true);
      setError(null);
      try {
        // Get the current user
        const res = await import("@/lib/api/auth").then((m) => m.currentUser());
        const guideId = res?.data?.user?.id; // Adjust if your user object is different
        if (!guideId) throw new Error("No tour guide ID found.");
        // Fetch documents for this guide
        const docs = await fetchGuideDocumentsById(guideId);
        setDocuments(Array.isArray(docs) ? docs : []);
      } catch (err: any) {
        setError(err.message || "Failed to load documents.");
      } finally {
        setLoading(false);
      }
    }
    fetchDocs();
  }, [fetchGuideDocumentsById]);

  if (loading || authLoading || docLoading)
    return <div>Loading documents...</div>;
  if (error || authError || docError)
    return <div>Error: {error || authError || docError}</div>;

  return (
    <div>
      <h1>Your Uploaded Documents</h1>
      {documents.length === 0 ? (
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
