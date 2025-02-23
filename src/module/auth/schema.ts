import { z } from "zod";


/**
 * Min 8 character
 * At least one uppercase letter
 * At least one lowercase letter
 * At least one number
 * At least one special character
 */
const passwordRegax = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export type SignInForm = z.infer<typeof signInFormSchema>;
export const signInFormSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Must be a valid email" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export type SignUpForm = z.infer<typeof signUpFormSchema>;
export const signUpFormSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Must be a valid email" }),
  password: z.string().min(1, { message: "Password is required" }).regex(passwordRegax, { message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character" }),
  confirmPassword: z.string().min(1, { message: "Confirm password is required" }),
  acceptTerms: z.boolean().refine((data) => !!data, {
    message: "You must accept the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});






