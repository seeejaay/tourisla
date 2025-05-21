import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address").toUpperCase(),
  password: z.string().min(1, "Password is required"),
});
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export { loginSchema, forgotPasswordSchema };
