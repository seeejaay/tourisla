import type { Rule } from "./useRuleManagerSchema";

export const ruleFields = [
  {
    name: "title",
    type: "text",
    label: "Title",
    placeholder: "Enter the title of the rule",
  },
  {
    name: "description",
    type: "textarea",
    label: "Description",
    placeholder: "Enter the description of the rule",
  },
  {
    name: "penalty",
    type: "text",
    label: "Penalty",
    placeholder: "Enter the penalty for violating this rule",
  },
  {
    name: "category",
    type: "text",
    label: "Category",
    placeholder: "Enter the category of the rule",
  },
  {
    name: "is_active",
    type: "checkbox",
    label: "Is Active",
    placeholder: "Check if the rule is currently active",
  },
  {
    name: "effective_date",
    type: "date",
    label: "Effective Date",
    placeholder: "Select the effective date of the rule",
  },
];
export type RuleWithmeta = Rule & {
  created_at: string;
  updated_at: string;
};
