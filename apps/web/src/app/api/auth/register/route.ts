/**
 * POST /api/auth/register
 *
 * Creates a new RECRUITER account.
 *
 * Request body (JSON):
 *   { name, email, password, confirmPassword }
 *
 * Success → 201 Created
 *   { success: true, user: SafeUser }
 *
 * Failure → 400 / 409 / 500
 *   { success: false, message: string, errors?: FieldErrors }
 */

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import { Role } from "@prisma/client";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** bcrypt work-factor. 12 rounds is a good balance of security vs. latency. */
const BCRYPT_ROUNDS = 12;

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Parse request body ------------------------------------------------
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON body." },
        { status: 400 },
      );
    }

    // 2. Validate with Zod --------------------------------------------------
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed. Please check the fields below.",
          errors,
        },
        { status: 400 },
      );
    }

    const { name, email, password } = parsed.data;

    // 3. Check email uniqueness --------------------------------------------
    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true }, // Minimal projection — we only need existence
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "An account with this email address already exists.",
          errors: { email: ["An account with this email address already exists."] },
        },
        { status: 409 },
      );
    }

    // 4. Hash password -------------------------------------------------------
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // 5. Persist user --------------------------------------------------------
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: Role.RECRUITER,
        // emailVerified is omitted → Prisma defaults it to null (unverified)
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        // passwordHash is intentionally NOT selected
      },
    });

    // 6. Return safe user object --------------------------------------------
    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully.",
        user,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    // Prisma unique-constraint violation (race condition fallback)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "An account with this email address already exists.",
          errors: { email: ["An account with this email address already exists."] },
        },
        { status: 409 },
      );
    }

    // Zod error surfaced outside safeParse (defensive)
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    // Unexpected server error — log internally, never expose internals
    console.error("[POST /api/auth/register] Unexpected error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 },
    );
  }
}
