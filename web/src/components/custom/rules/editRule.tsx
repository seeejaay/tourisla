"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ruleFields } from "@/app/static/rules/rule";
import {
  ruleSchema,
  type RuleSchema,
} from "@/app/static/rules/useRuleManagerSchema";

export default function EditRule({
  rule,
  onSave,
  onCancel,
}: {
  rule: RuleSchema;
  onSave: (updatedRule: RuleSchema) => void | Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<RuleSchema>({ ...rule });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, type, value } = e.target;
    if (type === "checkbox" && "checked" in e.target) {
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate with Zod schema
    const result = ruleSchema.safeParse(form);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ruleFields.map((field) => (
          <div className="space-y-1" key={field.name}>
            <Label
              htmlFor={field.name}
              className="text-sm font-semibold text-[#1c5461]"
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
                className="w-full text-sm border-[#e6f7fa] focus:ring-yellow-400 focus:border-yellow-400"
              />
            ) : field.type === "checkbox" ? (
              <div className="flex items-center gap-2 pt-2">
                <Checkbox
                  id={field.name}
                  checked={!!form[field.name as keyof RuleSchema]}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      [field.name]: checked,
                    }))
                  }
                />
                <Label htmlFor={field.name} className="text-sm text-gray-600">
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
                className="w-full text-sm border-[#e6f7fa] focus:ring-yellow-400 focus:border-yellow-400"
              />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="px-3 py-2 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="text-sm"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="text-sm bg-[#1c5461] hover:bg-[#17414a] text-white font-semibold px-6 py-2 rounded-lg"
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
}
