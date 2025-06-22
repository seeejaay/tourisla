import { useState, useCallback } from "react";

import { uploadOperatorQr, getOperatorQrById } from "@/lib/api/operatorQr";

export function useOperatorQrManager() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadQr = useCallback(
    async (file: File, touroperator_id: string, qr_name: string) => {
      setLoading(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append("qr_image", file);
        formData.append("tour_operator_id", touroperator_id);
        formData.append("qr_name", qr_name);

        console.log("Uploading QR code for tour operator:", formData);
        const result = await uploadOperatorQr(formData);
        console.log("Upload result:", result);
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

  const fetchQr = useCallback(async (touroperator_id: string) => {
    setLoading(true);
    setError(null);

    try {
      console.log(`Fetching QR code for tour operator: ${touroperator_id}`);

      const qrData = await getOperatorQrById(touroperator_id);
      console.log("Fetched QR data:", qrData);
      return qrData;
    } catch (error) {
      setError(error + "Unknown error");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { uploadQr, fetchQr, loading, error };
}
