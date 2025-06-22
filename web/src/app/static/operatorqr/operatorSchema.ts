import { z } from "zod";

const OperatorUploadSchema = z.object({
  qr_name: z
    .string()
    .min(4, "QR Code Name is required")
    .max(50, "QR Code Name must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9\s]+$/,
      "QR Code Name must contain only alphanumeric characters and spaces"
    ),
  qr_image: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "QR Code image must be less than 5MB.",
    })
    .refine((file) => file.type.startsWith("image/"), {
      message: "File must be an image.",
    }),
});

export default OperatorUploadSchema;
export type OperatorUpload = z.infer<typeof OperatorUploadSchema>;
