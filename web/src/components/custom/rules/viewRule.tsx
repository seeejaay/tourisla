import { Label } from "@/components/ui/label";

import type { Rule } from "@/app/static/rules/useRuleManagerSchema";

export default function ViewRule({ rule }: { rule: Rule }) {
  if (!rule) return null;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-1">
        <Label className="uppercase tracking-widest font-semibold text-xs text-muted-foreground">
          Title
        </Label>
        <span className="text-2xl font-bold">{rule.title}</span>
      </div>

      <div className="flex flex-col gap-1">
        <Label className="uppercase tracking-widest font-semibold text-xs text-muted-foreground">
          Description
        </Label>
        <span className="text-base break-words">{rule.description}</span>
      </div>

      <div className="flex flex-col gap-1">
        <Label className="uppercase tracking-widest font-semibold text-xs text-muted-foreground">
          Penalty
        </Label>
        <span>{rule.penalty}</span>
      </div>

      <div className="flex flex-col gap-1">
        <Label className="uppercase tracking-widest font-semibold text-xs text-muted-foreground">
          Category
        </Label>
        <span>{rule.category || "N/A"}</span>
      </div>
      <div className="flex flex-col gap-1">
        <Label className="uppercase tracking-widest font-semibold text-xs text-muted-foreground">
          Active
        </Label>
        <span>{rule.is_active ? "Yes" : "No"}</span>
      </div>
      <div className="flex flex-col gap-1">
        <Label className="uppercase tracking-widest font-semibold text-xs text-muted-foreground">
          Effective Date
        </Label>
        <span>
          {rule.effective_date
            ? new Date(rule.effective_date).toLocaleDateString()
            : "N/A"}
        </span>
      </div>
    </div>
  );
}
