import { z } from "zod";

const TourGuideDocumentSchema = z.object({
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

const TourOperatorDocumentSchema = z.object({
  id: z.number().optional(),
  document_type: z.enum([
    "LETTER_OF_INTENT",
    "BUSINESS_PERMIT",
    "DTI_OR_SEC",
    "BIR_CERTIFICATE",
    "PROOF_OF_OFFICE",
    "BRGY_CLEARANCE",
    "DOLE_REGISTRATION",
    "MANAGER_RESUME_ID",
    "MANAGER_PROOF_OF_EXPERIENCE",
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

export type TourGuideDocument = z.infer<typeof TourGuideDocumentSchema>;
export type TourGuideDocumentSchema = z.infer<typeof TourGuideDocumentSchema>;

export type TourOperatorDocument = z.infer<typeof TourOperatorDocumentSchema>;
export type TourOperatorDocumentSchema = z.infer<
  typeof TourOperatorDocumentSchema
>;
export { TourOperatorDocumentSchema, TourGuideDocumentSchema };
