/**
 * Zod validation schemas for authentication flows.
 *
 * Centralised here so the same rules can be reused if a
 * client-side form is added in a later milestone.
 *
 * NOTE: This project uses Zod v4. The `required_error` option was removed in
 * v4; use `error` (or rely on `.min(1)` messages) for required-field errors.
 */

import { z } from "zod";

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

export const registerSchema = z
  .object({
    /** Recruiter's full display name. */
    name: z
      .string()
      .trim()
      .min(1, "Full name is required.")
      .max(255, "Full name must be at most 255 characters."),

    /** Work email address. Must be unique in the database. */
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, "Email is required.")
      .email("Please enter a valid email address.")
      .max(255, "Email must be at most 255 characters."),

    /** Plaintext password — will be hashed before persistence. */
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(72, "Password must be at most 72 characters."), // bcrypt max input length

    /** Must equal `password` — validated via `.refine` below. */
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

/** Inferred TypeScript type for the raw registration input. */
export type RegisterInput = z.infer<typeof registerSchema>;

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------

export const loginSchema = z.object({
  /** Work email address. */
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),

  /** Plaintext password. */
  password: z
    .string()
    .min(1, "Password is required."),
});

/** Inferred TypeScript type for the raw login input. */
export type LoginInput = z.infer<typeof loginSchema>;


/**
 * Safe user shape returned to the caller.
 * Never includes `passwordHash` or any other sensitive field.
 */
export const safeUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.string(),
  emailVerified: z.date().nullable(),
  createdAt: z.date(),
});

export type SafeUser = z.infer<typeof safeUserSchema>;
