import { Label } from "@/components/ui/label";
import type { Rule } from "@/app/static/rules/useRuleManagerSchema";

export default function ViewRule({ rule }: { rule: Rule }) {
  if (!rule) return null;

  return (
    <div className="w-full flex flex-col items-center justify-center pb-3 ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-1">
          <Label className="uppercase tracking-widest font-semibold text-xs text-[#3e979f]">
            Title
          </Label>
          <span className="text-xl font-bold text-[#1c5461]">{rule.title}</span>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="uppercase tracking-widest font-semibold text-xs text-[#3e979f]">
            Category
          </Label>
          <span className="text-base text-[#17414a]">
            {rule.category || "N/A"}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="uppercase tracking-widest font-semibold text-xs text-[#3e979f]">
            Penalty
          </Label>
          <span className="text-base text-[#17414a]">{rule.penalty}</span>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="uppercase tracking-widest font-semibold text-xs text-[#3e979f]">
            Status
          </Label>
          <span
            className={
              rule.is_active
                ? "text-green-600 font-semibold"
                : "text-red-500 font-semibold"
            }
          >
            {rule.is_active ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="uppercase tracking-widest font-semibold text-xs text-[#3e979f]">
            Effective Date
          </Label>
          <span className="text-base text-[#17414a]">
            {rule.effective_date
              ? new Date(rule.effective_date).toLocaleDateString()
              : "N/A"}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="uppercase tracking-widest font-semibold text-xs text-[#3e979f]">
            Description
          </Label>
          <span className="text-base text-[#17414a] break-words">
            {rule.description}
          </span>
        </div>
      </div>
    </div>
  );
}
