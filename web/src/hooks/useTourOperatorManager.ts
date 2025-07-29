import { useState, useCallback } from "react";

import type { TourOperatorSchema } from "@/app/static/tour-operator/useTourOperatorManagerSchema";

import type { TourOperator } from "@/components/custom/tour-operator/column";
import {
  fetchTourOperatorApplicants as apifetchApplicants,
  fetchTourOperatorApplicant as apifetchApplicant,
  editTourOperatorApplicant as apieditApplicant,
  createTourOperatorApplicant as apicreateApplicant,
  deleteTourOperatorApplicant as apideleteApplicant,
  approveTourOperatorApplicant as apiapproveApplicant,
  rejectTourOperatorApplicant as apirejectApplicant,
} from "@/lib/api/tour-operator";

export const useTourOperatorManager = () => {
  const [OperatorApplicants, setOperatorApplicants] = useState<TourOperator[]>(
    []
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchApplicants = useCallback(async (): Promise<TourOperator[]> => {
    setLoading(true);
    setError("");

    try {
      const applicants = await apifetchApplicants();
      setOperatorApplicants(applicants);
      return applicants;
    } catch (err) {
      setError("Failed to fetch tour operator applicants.");
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchApplicant = useCallback(
    async (id: number): Promise<TourOperator | null> => {
      setLoading(true);
      setError("");
      try {
        const applicant = await apifetchApplicant(id);
        return applicant;
      } catch (err) {
        setError("Failed to fetch tour operator applicant.");
        console.error(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const editApplicant = useCallback(
    async (
      id: number,
      data: TourOperatorSchema
    ): Promise<TourOperator | null> => {
      setLoading(true);
      setError("");

      try {
        const updatedApplicant = await apieditApplicant(id, data);
        setOperatorApplicants((prev) =>
          prev.map((applicant) =>
            applicant.id === id ? updatedApplicant : applicant
          )
        );
        return updatedApplicant;
      } catch (err) {
        setError("Failed to edit tour operator applicant.");
        console.error(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createApplicant = useCallback(
    async (data: TourOperatorSchema): Promise<TourOperator | null> => {
      setLoading(true);
      setError("");

      try {
        const newApplicant = await apicreateApplicant(data);
        setOperatorApplicants((prev) => [...prev, newApplicant]);
        return newApplicant;
      } catch (err) {
        setError("Failed to create tour operator applicant.");
        console.error(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteApplicant = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError("");

    try {
      await apideleteApplicant(id);
      setOperatorApplicants((prev) =>
        prev.filter((applicant) => applicant.id !== id)
      );
      return true;
    } catch (err) {
      setError("Failed to delete tour operator applicant.");
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const approveApplicant = useCallback(
    async (id: number): Promise<TourOperator | null> => {
      setLoading(true);
      setError("");

      try {
        const approvedApplicant = await apiapproveApplicant(id);
        setOperatorApplicants((prev) =>
          prev.map((applicant) =>
            applicant.id === id ? approvedApplicant : applicant
          )
        );
        return approvedApplicant;
      } catch (err) {
        setError("Failed to approve tour operator applicant.");
        console.error(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const rejectApplicant = useCallback(
    async (id: number): Promise<TourOperator | null> => {
      setLoading(true);
      setError("");

      try {
        const rejectedApplicant = await apirejectApplicant(id);
        setOperatorApplicants((prev) =>
          prev.map((applicant) =>
            applicant.id === id ? rejectedApplicant : applicant
          )
        );
        return rejectedApplicant;
      } catch (err) {
        setError("Failed to reject tour operator applicant.");
        console.error(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    OperatorApplicants,
    loading,
    error,
    fetchApplicants,
    fetchApplicant,
    editApplicant,
    createApplicant,
    deleteApplicant,
    approveApplicant,
    rejectApplicant,
  };
};
