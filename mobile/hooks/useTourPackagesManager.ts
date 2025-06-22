import { useState, useCallback } from "react";
import {
  createTourPackage,
  editTourPackage,
  deleteTourPackage,
  fetchTourPackages,
  fetchTourPackage,
  fetchAllTourPackages as apiFetchAllTourPackages,
  fetchTourPackagesByGuide as apiFetchTourPackagesByGuide,
} from "@/lib/api/tour-packages";
import tourPackageSchema, {
  TourPackage,
} from "@/static/tour-packages/tour-packageSchema";

export const useTourPackageManager = () => {
  const [tourPackages, setTourPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Fetch all tour packages
  const fetchAll = useCallback(async (): Promise<TourPackage[]> => {
    setLoading(true);
    setError("");
    try {
      console.log("Fetching tour packages");

      const packages = await fetchTourPackages();
      setTourPackages(packages);
      console.log("API Tour packages fetched successfully:", packages);
      return packages;
    } catch (err) {
      setError("Failed to fetch tour packages.");
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllTourPackages = useCallback(async (): Promise<TourPackage[]> => {
    setLoading(true);
    setError("");
    try {
      const packages = await apiFetchAllTourPackages();
      setTourPackages(packages);
      console.log("API Tour packages fetched successfully:", packages);
      return packages;
    } catch (err) {
      setError("Failed to fetch all tour packages.");
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single tour package
  const fetchOne = useCallback(
    async (id: number | string): Promise<TourPackage | null> => {
      setLoading(true);
      setError("");
      try {
        console.log(`Fetching tour package with ID: ${id}`);

        const pkg = await fetchTourPackage(id);
        console.log("API Tour package fetched successfully:", pkg);
        return pkg;
      } catch (err) {
        setError("Failed to fetch tour package.");
        console.error(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Create tour package
  const create = useCallback(
    async (data: Partial<TourPackage>): Promise<TourPackage | null> => {
      setLoading(true);
      setError("");
      console.log("Front end Creating tour package with data:", data);
      try {
        // const validated = tourPackageSchema.parse(data);
        const newPackage = await createTourPackage(data);
        setTourPackages((prev) => [...prev, newPackage]);
        return newPackage;
      } catch (err) {
        setError(err + "Failed to create tour package.");
        console.error(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Edit tour package
  const edit = useCallback(
    async (
      id: number | string,
      data: Partial<TourPackage>
    ): Promise<TourPackage | null> => {
      setLoading(true);
      setError("");
      try {
        const validated = tourPackageSchema.parse(data);
        const updatedPackage = await editTourPackage(id, validated);
        setTourPackages((prev) =>
          prev.map((pkg) => (pkg.id === id ? updatedPackage : pkg))
        );
        return updatedPackage;
      } catch (err) {
        setError(err + "Failed to edit tour package.");
        console.error(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Delete tour package
  const remove = useCallback(async (id: number | string): Promise<boolean> => {
    setLoading(true);
    setError("");
    try {
      await deleteTourPackage(id);
      setTourPackages((prev) => prev.filter((pkg) => pkg.id !== id));
      return true;
    } catch (err) {
      setError("Failed to delete tour package.");
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTourPackagesByGuide = useCallback(
    async (guideId: string): Promise<TourPackage[]> => {
      setLoading(true);
      setError("");

      try {
        console.log(`Fetching tour packages by guide ID: ${guideId}`);
        const packages = await apiFetchTourPackagesByGuide(guideId); // <-- Use the API function
        setTourPackages(packages);
        console.log(
          "API Tour packages by guide fetched successfully:",
          packages
        );
        return packages;
      } catch (err) {
        setError("Failed to fetch tour packages by guide.");
        console.error(err);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    tourPackages,
    loading,
    error,
    fetchAll,
    fetchOne,
    create,
    edit,
    remove,
    setTourPackages, // Exposed for manual updates if needed
    fetchAllTourPackages,
    fetchTourPackagesByGuide, // Exposed for fetching all tour packages
  };
};
