"use client";

import { useState } from "react";
import { useRuleManager } from "@/hooks/useRuleManager";
import { ruleFields } from "@/app/static/rules/rule";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { RuleSchema } from "@/app/static/rules/useRuleManagerSchema";

export default function AddRule({
  onSuccess,
  onCancel,
}: {
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  // Explicitly type initialForm as RuleSchema
  const initialForm: RuleSchema = {
    title: "",
    description: "",
    penalty: "",
    category: "",
    is_active: false,
    effective_date: "",
  };

  const [form, setForm] = useState<RuleSchema>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createRule } = useRuleManager();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, type, value } = e.target;
    if (type === "checkbox" && "checked" in e.target) {
      setForm((prev: RuleSchema) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setForm((prev: RuleSchema) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const ruleData: RuleSchema = { ...form };
      const result = await createRule(ruleData);
      if (result) {
        if (onSuccess) onSuccess();
        setForm(initialForm);
      }
    } catch (err) {
      setError(
        "Failed to create rule. Please try again. " +
          (err instanceof Error ? err.message : "")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-6 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ruleFields.map((field) => (
          <div className="space-y-1" key={field.name}>
            <Label
              htmlFor={field.name}
              className="text-sm font-medium text-gray-600"
            >
              {field.label}
            </Label>
            {field.type === "textarea" ? (
              <Textarea
                id={field.name}
                name={field.name}
                value={form[field.name as keyof RuleSchema] as string}
                onChange={handleChange}
                placeholder={field.placeholder}
                rows={3}
                className="w-full text-sm"
              />
            ) : field.type === "checkbox" ? (
              <div className="flex items-center gap-2">
                <Checkbox
                  id={field.name}
                  checked={!!form[field.name as keyof RuleSchema]}
                  onCheckedChange={(checked) =>
                    setForm((prev: RuleSchema) => ({
                      ...prev,
                      [field.name]: checked,
                    }))
                  }
                />
                <Label htmlFor={field.name} className="text-sm">
                  {field.placeholder}
                </Label>
              </div>
            ) : (
              <Input
                id={field.name}
                type={field.type}
                name={field.name}
                value={form[field.name as keyof RuleSchema] as string}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full text-sm"
              />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="px-3 py-2 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2 justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="text-sm"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={loading}
          className="text-sm bg-blue-600 hover:bg-blue-700"
        >
          {loading ? "Adding..." : "Add Rule"}
        </Button>
      </div>
    </form>
  );
}
