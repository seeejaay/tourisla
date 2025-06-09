import { z } from "zod";

const ruleSchema = z.object({
  id: z.number().optional(),
  title: z
    .string()
    .min(3, { message: "Title is required." })
    .max(100, { message: "Title must be less than 100 characters." })
    .regex(/^[a-zA-Z0-9\s.,-]+$/, {
      message:
        "Title can only contain letters, numbers, spaces, commas, periods, and hyphens.",
    }),
  description: z
    .string()
    .min(10, { message: "Description is required." })
    .max(500, { message: "Description must be less than 500 characters." })
    .regex(/^[a-zA-Z0-9\s.,-]+$/, {
      message:
        "Description can only contain letters, numbers, spaces, commas, periods, and hyphens.",
    }),
  penalty: z
    .string()
    .min(3, { message: "Penalty is required." })
    .max(200, { message: "Penalty must be less than 200 characters." })
    .regex(/^[a-zA-Z0-9\s.,-]+$/, {
      message:
        "Penalty can only contain letters, numbers, spaces, commas, periods, and hyphens.",
    }),

  category: z
    .string()
    .min(3, { message: "Category is required." })
    .max(50, { message: "Category must be less than 50 characters." })
    .regex(/^[a-zA-Z0-9\s.,-]+$/, {
      message:
        "Category can only contain letters, numbers, spaces, commas, periods, and hyphens.",
    }),
  is_active: z.boolean().optional(),
  effective_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Effective date must be in YYYY-MM-DD format.",
    })
    .refine(
      (date) => {
        const today = new Date();
        const effectiveDate = new Date(date);
        return effectiveDate >= today;
      },
      {
        message: "Effective date must be today or in the future.",
      }
    )

    .optional(),
});

export type Rule = z.infer<typeof ruleSchema>;
export type RuleSchema = z.infer<typeof ruleSchema>;
export { ruleSchema };
