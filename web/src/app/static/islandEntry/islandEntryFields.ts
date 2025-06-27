import { GroupMember } from "@/app/islandEntry-regis/page";

export const islandEntryFields = [
  { name: "name", label: "Name", type: "text" },
  {
    name: "sex",
    label: "Sex",
    type: "select",
    options: ["Male", "Female", "Other"],
  },
  { name: "age", label: "Age", type: "number" },
  { name: "is_foreign", label: "Foreign?", type: "checkbox" },
  {
    name: "municipality",
    label: "Municipality",
    type: "text",
    showIf: (v: GroupMember) => !v.is_foreign,
  },
  {
    name: "province",
    label: "Province",
    type: "text",
    showIf: (v: GroupMember) => !v.is_foreign,
  },
  {
    name: "country",
    label: "Country",
    type: "text",
    showIf: (v: GroupMember) => v.is_foreign,
  },
];
