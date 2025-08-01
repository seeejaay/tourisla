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
  approveTourGuideDocument,
  rejectTourGuideDocument,
  revokeTourGuideDocument as revokeTourGuideDocumentapi,
  approveTourOperatorDocument,
  rejectTourOperatorDocument,
  revokeTourOperatorDocument as revokeTourOperatorDocumentapi,
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
        const doc = await uploadGuideDocument(guideId, formData);
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
    async (docuId: string, documentData: FormData) => {
      setLoading(true);
      setError(null);
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
      const docs = await getGuideDocumentsByUserId(guideId);
      setGuideDocument(docs);
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
        const doc = await uploadOperatorDocument(operatorId, formData);
        // setOperatorDocument(doc); // Uncomment if you want to store operator document
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

  const approveGuideDocument = useCallback(async (docuId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await approveTourGuideDocument(docuId);
      return response;
    } catch (error) {
      setError(error + "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const rejectGuideDocument = useCallback(
    async (docuId: string, reason: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await rejectTourGuideDocument(docuId, reason);
        return response;
      } catch (error) {
        setError(error + "Unknown error");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const revokeTourGuideDocument = useCallback(
    async (docuId: string, reason: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await revokeTourGuideDocumentapi(docuId, reason);
        return response;
      } catch (error) {
        setError(error + "Unknown error");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const approveOperatorDocument = useCallback(async (docuId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await approveTourOperatorDocument(docuId);
      return response;
    } catch (error) {
      setError(error + "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const rejectOperatorDocument = useCallback(async (docuId: string, reason: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await rejectTourOperatorDocument(docuId, reason);
      return response;
    } catch (error) {
      setError(error + "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const revokeTourOperatorDocument = useCallback(
    async (docuId: string, reason: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await revokeTourOperatorDocumentapi(docuId, reason);
        return response;
      } catch (error) {
        setError(error + "Unknown error");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

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
    approveGuideDocument,
    rejectGuideDocument,
    revokeTourGuideDocument,
    approveOperatorDocument,
    rejectOperatorDocument,
    revokeTourOperatorDocument,
  };
};
