import { useState, useCallback } from "react";
import {
  applyToTourOperator,
  fetchApplicationsForTourOperator,
  approveTourGuideApplication,
  rejectTourGuideApplication,
  fetchAllApplications,
  fetchGuideApplication as fetchGuideApplicationById,
} from "@/lib/api/applyTourOperator";

export function useApplyOperatorManager() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apply = useCallback(
    async (
      tourguide_id: string,
      touroperator_id: string,
      reason_for_applying: string
    ) => {
      setLoading(true);
      setError(null);
      try {
        const result = await applyToTourOperator(
          tourguide_id,
          touroperator_id,
          reason_for_applying
        );
        return result;
      } catch (error) {
        setError(error + "Unknown error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchApplications = useCallback(async (operatorId: string) => {
    setLoading(true);
    setError(null);
    try {
      const application = await fetchApplicationsForTourOperator(operatorId);

      return application;
    } catch (error) {
      setError(error + "Unknown error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const approve = useCallback(async (applicationId: string) => {
    setLoading(true);
    setError(null);
    try {
      return await approveTourGuideApplication(applicationId);
    } catch (error) {
      setError(error + "Unknown error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const reject = useCallback(async (applicationId: string) => {
    setLoading(true);
    setError(null);
    try {
      return await rejectTourGuideApplication(applicationId);
    } catch (error) {
      setError(error + "Unknown error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const applications = await fetchAllApplications();

      return applications;
    } catch (error) {
      setError(error + "Unknown error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGuideApplication = useCallback(
    async (tourguide_id: string, touroperator_id: string) => {
      setLoading(true);
      setError(null);
      try {
        const application = await fetchGuideApplicationById(
          tourguide_id,
          touroperator_id
        );

        return application;
      } catch (error) {
        setError(error + "Unknown error");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    apply,
    fetchApplications,
    approve,
    fetchAll,
    reject,
    fetchGuideApplication,
  };
}
