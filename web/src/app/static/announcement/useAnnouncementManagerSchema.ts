import { z } from "zod";

const announcementSchema = z.object({
  id: z.string().optional(),
  title: z
    .string()
    .min(1, { message: "Title is required." })
    .max(100, { message: "Title must be less than 100 characters." })
    .regex(/^[a-zA-Z0-9\s.,!]+$/, {
      message:
        "Title can only contain letters, numbers, spaces, periods, commas, and exclamation points.",
    }),
  description: z
    .string()
    .min(1, { message: "Description is required." })
    .max(500, { message: "Description must be less than 500 characters." }),
  date_posted: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Date Posted must be in YYYY-MM-DD format.",
    })
    .default(() => new Date().toISOString().slice(0, 10)),
  location: z
    .string()
    .max(100, { message: "Location must be less than 100 characters." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Location can only contain letters and spaces.",
    })
    .optional(),
  category: z
    .string()
    .max(50, { message: "Category must be less than 50 characters." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Category can only contain letters and spaces.",
    })
    .optional(),
  image_url: z
    .string()
    .max(200, { message: "Image URL must be less than 200 characters." })
    .optional(),
});

export type Announcement = z.infer<typeof announcementSchema>;
export type AnnouncementSchema = z.infer<typeof announcementSchema>;
export { announcementSchema };
