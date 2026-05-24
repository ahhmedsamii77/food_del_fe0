import { z } from "zod";

export const signupSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" })
      .max(20, { message: "Username must be at most 20 characters" })
      .regex(/^[a-zA-Z ]+$/, { message: "Username must contain only letters" }),
    email: z.string().email({ message: "Invalid email" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    phone: z.string().regex(/^\+?[0-9\s\-]{7,20}$/, {
      message: "Invalid phone number",
    }),
    gender: z.enum(["male", "female"], {
      message: "Invalid gender",
    }),
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
