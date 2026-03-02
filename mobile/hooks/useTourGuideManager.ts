import { useState, useCallback } from "react";

import type {
  TourGuideSchema,
  TourGuide,
} from "@/static/tour-guide/useTourGuideManagerSchema";

import {
  fetchTourGuideApplicants as apiFetchTourGuideApplications,
  fetchTourGuideApplicant as apiFetchTourGuideApplicant,
  createTourGuideApplicant as apiCreateTourGuideApplicant,
  editTourGuideApplicant as apiEditTourGuideApplicant,
  deleteTourGuideApplicant as apiDeleteTourGuideApplicant,
  fetchAllTourGuideApplicants as apiFetchAllTourGuideApplicants,
  fetchOneTourGuideApplicant as apiFetchOneTourGuideApplicant,
  approveTourGuideApplicant as apiApproveTourGuideApplicant,
  rejectTourGuideApplicant as apiRejectTourGuideApplicant,
} from "../lib/api/tour-guide";

export const useTourGuideManager = () => {
  const [tourGuideApplicants, setTourGuideApplicants] = useState<TourGuide[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Fetch all tour guide applicants
  const fetchTourGuideApplicants = useCallback(async (): Promise<
    TourGuide[] | null
  > => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetchTourGuideApplications();
      setTourGuideApplicants(data);
      return data;
    } catch (err) {
      setError("Error: " + (err instanceof Error ? err.message : String(err)));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new tour guide applicant
  const createTourGuideApplicant = useCallback(
    async (tourGuideData: TourGuideSchema): Promise<TourGuide | null> => {
      setLoading(true);
      setError("");
      try {
        const response: TourGuide & { error?: string } =
          await apiCreateTourGuideApplicant(tourGuideData);
        if (response.error) {
          setError(response.error);
          return null;
        }
        setTourGuideApplicants((prev) => [...prev, response]);
        return response;
      } catch (error) {
        setError(
          "An error occurred while creating the tour guide applicant." +
            (error instanceof Error ? error.message : String(error))
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Edit an existing tour guide applicant
  const editTourGuideApplicant = useCallback(
    async (
      id: string,
      tourGuideData: TourGuideSchema
    ): Promise<TourGuide | null> => {
      setLoading(true);
      setError("");
      try {
        const response: TourGuide & { error?: string } =
          await apiEditTourGuideApplicant(id, tourGuideData);
        if (response.error) {
          setError(response.error);
          return null;
        }
        setTourGuideApplicants((prev) =>
          prev.map((applicant) =>
            applicant.id === Number(id) ? response : applicant
          )
        );
        return response;
      } catch (error) {
        setError(
          "An error occurred while editing the tour guide applicant." +
            (error instanceof Error ? error.message : String(error))
        );
        return null;
      }
    },
    []
  );
  // Delete a tour guide applicant
  const deleteTourGuideApplicant = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true);
      setError("");
      try {
        const response = await apiDeleteTourGuideApplicant(id);
        if (response.error) {
          setError(response.error);
          return false;
        }
        setTourGuideApplicants((prev) =>
          prev.filter((applicant) => applicant.id !== Number(id))
        );
        return true;
      } catch (error) {
        setError(
          "An error occurred while deleting the tour guide applicant." +
            (error instanceof Error ? error.message : String(error))
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );
  // Fetch a specific tour guide applicant by ID
  const fetchTourGuideApplicant = useCallback(
    async (id: string): Promise<TourGuide | null> => {
      setLoading(true);
      setError("");
      try {
        const response = await apiFetchTourGuideApplicant(id);
        if (response.error) {
          setError(response.error);
          return null;
        }
        return response;
      } catch (error) {
        setError(
          "An error occurred while fetching the tour guide applicant." +
            (error instanceof Error ? error.message : String(error))
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );
  // Fetch all tour guide applicants
  const fetchAllTourGuideApplicants = useCallback(async (): Promise<
    TourGuide[] | null
  > => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetchAllTourGuideApplicants();
      return data;
    } catch (error) {
      setError(
        "An error occurred while fetching all tour guide applicants." +
          (error instanceof Error ? error.message : String(error))
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  // Fetch a single tour guide applicant
  const fetchOneTourGuideApplicant = useCallback(
    async (id: string): Promise<TourGuide | null> => {
      setLoading(true);
      setError("");
      try {
        const data = await apiFetchOneTourGuideApplicant(id);
        return data;
      } catch (error) {
        setError(
          "An error occurred while fetching the tour guide applicant." +
            (error instanceof Error ? error.message : String(error))
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );
  // Approve a tour guide applicant
  const approveTourGuideApplicant = useCallback(
    async (id: string): Promise<TourGuide | null> => {
      setLoading(true);
      setError("");
      try {
        const response = await apiApproveTourGuideApplicant(id);
        if (response.error) {
          setError(response.error);
          return null;
        }
        return response;
      } catch (error) {
        setError(
          "An error occurred while approving the tour guide applicant." +
            (error instanceof Error ? error.message : String(error))
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );
  // Reject a tour guide applicant
  const rejectTourGuideApplicant = useCallback(
    async (id: string): Promise<TourGuide | null> => {
      setLoading(true);
      setError("");
      try {
        const response = await apiRejectTourGuideApplicant(id);
        if (response.error) {
          setError(response.error);
          return null;
        }
        return response;
      } catch (error) {
        setError(
          "An error occurred while rejecting the tour guide applicant." +
            (error instanceof Error ? error.message : String(error))
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    tourGuideApplicants,
    loading,
    error,
    fetchTourGuideApplicants,
    createTourGuideApplicant,
    editTourGuideApplicant,
    deleteTourGuideApplicant,
    fetchTourGuideApplicant,
    fetchAllTourGuideApplicants,
    fetchOneTourGuideApplicant,
    approveTourGuideApplicant,
    rejectTourGuideApplicant,
  };
};
