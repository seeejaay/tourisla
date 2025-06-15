import { z } from "zod";
import categories from "./category.json"; // Assuming categories.json is in the same directory
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
  category: z.enum([...categories] as [string, ...string[]], {
    required_error: "Category is required.",
    invalid_type_error: "Invalid category.",
  }),
  image_url: z.string().optional(),
});

export type Announcement = z.infer<typeof announcementSchema>;
export type AnnouncementSchema = z.infer<typeof announcementSchema>;
export { announcementSchema };
