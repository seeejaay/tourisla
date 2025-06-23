import { z } from "zod";

const articleSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  body: z.string().min(1, "Body is required"),
  video_url: z.string().url().optional(),
  // thumbnail_url: z.union([
  // z.string().url({ message: "Invalid URL" }),
  // z.literal(""),
  // z.undefined(),  
  // ]),
  tags: z.string().optional(),
  status: z.enum(["PUBLISHED", "DRAFT", "published", "draft"]),
  is_featured: z.boolean(),
  updated_by: z.string(),
});

export type Article = z.infer<typeof articleSchema>;
export type ArticleSchema = z.infer<typeof articleSchema>;
export { articleSchema };
