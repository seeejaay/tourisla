import { useState, useCallback } from "react";

import type {
  TourOperatorSchema,
  TourOperator,
} from "@/app/static/tour-operator/useTourOperatorManagerSchema";

import {
  fetchTourOperatorApplicants as apifetchApplicants,
  fetchTourOperatorApplicant as apifetchApplicant,
  editTourOperatorApplicant as apieditApplicant,
  createTourOperatorApplicant as apicreateApplicant,
  deleteTourOperatorApplicant as apideleteApplicant,
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
        console.log("New applicant created:", newApplicant);
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

  return {
    OperatorApplicants,
    loading,
    error,
    fetchApplicants,
    fetchApplicant,
    editApplicant,
    createApplicant,
    deleteApplicant,
  };
};
