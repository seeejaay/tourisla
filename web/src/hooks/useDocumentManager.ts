import { useState, useCallback } from "react";
import {
  createGuideUploadDocu,
  editGuideUploadDocu,
  fetchGuideUploadDocuById,
  createOperatorUploadDocu,
  editOperatorUploadDocu,
  fetchOperatorUploadDocuById,
  fetchGuideUploadDocuByGuideId,
} from "@/lib/api/document";

type GuideDocument = {
  id?: number;
  tourguide_id?: number;
  document_type: string;
  requirements?: string[];
  file_path?: string;
};

type OperatorDocument = {
  id?: number;
  operator_id?: number;
  document_type: string;
  file_path?: string;
};

export const useDocumentManager = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guideDocument, setGuideDocument] = useState<GuideDocument | null>(
    null
  );
  const [operatorDocument, setOperatorDocument] =
    useState<OperatorDocument | null>(null);

  // Guide: Create
  const createGuideDocument = useCallback(
    async (guideId: string, documentData: GuideDocument, file: File) => {
      setLoading(true);
      setError(null);
      try {
        console.log("Creating guide document with data:", {
          guideId,
          documentData,
          file,
        });
        const doc = await createGuideUploadDocu(guideId, documentData, file);
        setGuideDocument(doc);
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
    async (docuId: string, documentData: GuideDocument, file?: File) => {
      setLoading(true);
      setError(null);
      try {
        const doc = await editGuideUploadDocu(docuId, documentData, file);
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
    setLoading(true);
    setError(null);
    try {
      const doc = await fetchGuideUploadDocuById(docuId);
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
      const docs = await fetchGuideUploadDocuByGuideId(guideId);
      setGuideDocument(docs);
      return docs;
    } catch (error) {
      setError(error + "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Operator: Create
  const createOperatorDocument = useCallback(
    async (operatorId: string, documentData: OperatorDocument, file: File) => {
      setLoading(true);
      setError(null);
      try {
        const doc = await createOperatorUploadDocu(
          operatorId,
          documentData,
          file
        );
        setOperatorDocument(doc);
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

  // Operator: Edit
  const editOperatorDocument = useCallback(
    async (docuId: string, documentData: OperatorDocument, file?: File) => {
      setLoading(true);
      setError(null);
      try {
        const doc = await editOperatorUploadDocu(docuId, documentData, file);
        setOperatorDocument(doc);
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

  // Operator: Fetch by ID
  const fetchOperatorDocument = useCallback(async (docuId: string) => {
    setLoading(true);
    setError(null);
    try {
      const doc = await fetchOperatorUploadDocuById(docuId);
      setOperatorDocument(doc);
      return doc;
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
    operatorDocument,
    createGuideDocument,
    editGuideDocument,
    fetchGuideDocument,
    fetchGuideDocumentsById,
    createOperatorDocument,
    editOperatorDocument,
    fetchOperatorDocument,
  };
};
