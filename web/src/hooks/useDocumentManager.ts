import { useState, useCallback } from "react";
import {
  uploadGuideDocument,
  editGuideDocument as apiEditGuideDocument,
  getGuideDocumentById,
  getGuideDocumentsByUserId,
  uploadOperatorDocument,
  editOperatorDocument as editOperatorUploadDocu,
  getOperatorDocumentById,
  getOperatorDocumentsByUserId,
} from "@/lib/api/document";

type GuideDocument = {
  id?: number;
  tourguide_id?: number;
  document_type: string;
  requirements?: string[];
  file_path?: string;
};

// type OperatorDocument = {
//   id?: number;
//   operator_id?: number;
//   document_type: string;
//   file_path?: string;
// };

export const useDocumentManager = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guideDocument, setGuideDocument] = useState<GuideDocument | null>(
    null
  );
  // const [operatorDocument, setOperatorDocument] =
  //   useState<OperatorDocument | null>(null);

  // Guide: Create
  const createGuideDocument = useCallback(
    async (guideId: string, formData: FormData) => {
      setLoading(true);
      setError(null);
      try {
        console.log("Creating document for guide");
        const doc = await uploadGuideDocument(guideId, formData);
        setGuideDocument(doc);
        console.log("Document created");
        return doc;
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Unknown error");
        }
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Guide: Edit
  const editGuideDocument = useCallback(
    async (docuId: string, documentData: FormData) => {
      setLoading(true);
      setError(null);
      console.log("Sending document data for edit");
      try {
        const doc = await apiEditGuideDocument(docuId, documentData);
        setGuideDocument(doc);
        return doc;
      } catch (error) {
        setError(error + "Unknown error");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Guide: Fetch by ID
  const fetchGuideDocument = useCallback(async (docuId: string) => {
    console.log("Fetching guide document by ID");
    setLoading(true);
    setError(null);
    try {
      const doc = await getGuideDocumentById(docuId);
      setGuideDocument(doc);
      return doc;
    } catch (error) {
      setError(error + "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGuideDocumentsById = useCallback(async (guideId: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching guide documents by user ID:", guideId);
      const docs = await getGuideDocumentsByUserId(guideId);
      setGuideDocument(docs);
      console.log("Fetched guide documents");
      return docs;
    } catch (error) {
      setError(error + "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createOperatorDocument = useCallback(
    async (operatorId: string, formData: FormData) => {
      setLoading(true);
      setError(null);
      try {
        console.log("Creating document for operator");
        const doc = await uploadOperatorDocument(operatorId, formData);
        // setOperatorDocument(doc); // Uncomment if you want to store operator document
        console.log("Operator document created");
        return doc;
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Unknown error");
        }
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const editOperatorDocument = useCallback(
    async (docuId: string, documentData: FormData) => {
      setLoading(true);
      setError(null);
      console.log("Sending operator document data for edit");
      try {
        const doc = await editOperatorUploadDocu(docuId, documentData);
        // setOperatorDocument(doc); // Uncomment if you want to store operator document
        return doc;
      } catch (error) {
        setError(error + "Unknown error");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchOperatorDocument = useCallback(async (docuId: string) => {
    console.log("Fetching operator document by ID");
    setLoading(true);
    setError(null);
    try {
      const doc = await getOperatorDocumentById(docuId);
      // setOperatorDocument(doc); // Uncomment if you want to store operator document
      return doc;
    } catch (error) {
      setError(error + "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOperatorDocumentsById = useCallback(async (operatorId: string) => {
    setLoading(true);
    setError(null);
    try {
      const docs = await getOperatorDocumentsByUserId(operatorId);
      // setOperatorDocument(docs); // Uncomment if you want to store operator document
      return docs;
    } catch (error) {
      setError(error + "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    guideDocument,
    // operatorDocument,
    createGuideDocument,
    editGuideDocument,
    fetchGuideDocument,
    fetchGuideDocumentsById,
    createOperatorDocument,
    editOperatorDocument,
    fetchOperatorDocument,
    fetchOperatorDocumentsById,
  };
};
