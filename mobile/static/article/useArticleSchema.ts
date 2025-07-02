import { z } from "zod";

const articleSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  content: z.string().min(1, "Content is required"), // changed from body
  video_url: z.string().url().optional(),
  tags: z.string().optional(),
  type: z.string().min(1, "Type is required"),
  barangay: z.string().optional(),
  summary: z.string().optional(),
  is_published: z.boolean(), // changed from status
  is_featured: z.boolean(),
  updated_by: z.string(),
});

export type Article = z.infer<typeof articleSchema>;
export type ArticleSchema = z.infer<typeof articleSchema>;
export { articleSchema };
