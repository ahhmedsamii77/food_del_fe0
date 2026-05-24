import { z } from "zod";

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "Name must be at least 3 characters" })
      .max(50, { message: "Name must be at most 50 characters" })
      .regex(/^[a-zA-Z ]+$/, { message: "Name must contain only letters" }),
    email: z.string().email({ message: "Invalid email" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
}).strict();

export const confirmEmailSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  otp: z.string().length(6, { message: "OTP must be 6 digits" }),
}).strict();

export const sendResetPasswordOtpSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
}).strict();

export const verifyResetPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  otp: z.string().length(6, { message: "OTP must be 6 digits" }),
}).strict();

export const resetPasswordSchema = z
  .object({
    email: z.string().email({ message: "Invalid email" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });
