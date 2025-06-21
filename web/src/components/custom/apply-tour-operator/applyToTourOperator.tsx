"use client";

import React, { useState } from "react";
import { useApplyOperatorManager } from "@/hooks/useApplyOperatorManager";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
type ApplyToTourOperatorFormProps = {
  tourguide_id: string;
  touroperator_id: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

const ApplyToTourOperatorForm: React.FC<ApplyToTourOperatorFormProps> = ({
  tourguide_id,
  touroperator_id,
  onSuccess,
  onCancel,
}) => {
  const { apply, loading, error } = useApplyOperatorManager();
  const [reason, setReason] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!reason.trim()) {
      setFormError("Reason for applying is required.");
      return;
    }

    try {
      await apply(tourguide_id, touroperator_id, reason);
      if (onSuccess) onSuccess();
    } catch (err) {
      setFormError(err + "Failed to apply.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="block mb-1 font-medium">Reason for Applying</label>
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Why do you want to join this tour operator?"
          disabled={loading}
          required
        />
      </div>
      {(formError || error) && (
        <div className="text-red-600">{formError || error}</div>
      )}
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Applying..." : "Submit Application"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default ApplyToTourOperatorForm;
