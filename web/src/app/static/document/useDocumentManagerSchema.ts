import { z } from "zod";

const documentSchema = z.object({
  id: z.number().optional(),
  document_type: z.enum([
    "GOV_ID",
    "BIRTH_CERT",
    "NBI_CLEARANCE",
    "BRGY_CLEARANCE",
    "MED_CERT",
    "PASSPORT PHOTO",
    "RESUME",
  ]),
  file_path: z
    .instanceof(File, {
      message: "File must be a valid file.",
    })
    .refine(
      (file) => file.size <= 5 * 1024 * 1024, // 5MB limit
      {
        message: "File must be less than 5MB.",
      }
    )
    .refine(
      (file) =>
        file.type.startsWith("image/") ||
        file.type.startsWith("application/pdf"),
      {
        message: "File must be an image or PDF.",
      }
    ),
});

export type Document = z.infer<typeof documentSchema>;
export type DocumentSchema = z.infer<typeof documentSchema>;
export { documentSchema };
