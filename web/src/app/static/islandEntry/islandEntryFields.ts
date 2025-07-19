import { GroupMember } from "@/app/islandEntry-regis/page";
import countries from "@/app/static/countries.json";
export const islandEntryFields = [
  { name: "name", label: "Name", type: "text" },
  {
    name: "sex",
    label: "Sex",
    type: "select",
    options: ["Male", "Female", "Other"],
  },
  { name: "age", label: "Age", type: "number" },
  { name: "is_foreign", label: "Foreign Visitor?", type: "checkbox" },
  {
    name: "province",
    label: "Province",
    type: "select",
    options: [],
    showIf: (v: GroupMember) => !v.is_foreign,
  },
  {
    name: "municipality",
    label: "Municipality",
    type: "select",
    options: [],
    showIf: (v: GroupMember) => !v.is_foreign,
  },
  {
    name: "country",
    label: "Country",
    type: "select",
    options: countries.map((country) => ({
      label: country.name,
      value: country.name,
    })),
  },
];
