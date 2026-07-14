import NextAuth, { CredentialsSignin } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { authConfig } from "./auth.config";
import { loginSchema } from "@/lib/validations/auth";

// ---------------------------------------------------------------------------
// Custom Auth.js Errors
// ---------------------------------------------------------------------------

export class InvalidCredentialsError extends CredentialsSignin {
  code = "invalid_credentials";
}

export class UserNotFoundError extends CredentialsSignin {
  code = "user_not_found";
}

export class InternalAuthError extends CredentialsSignin {
  code = "internal_server_error";
}

// ---------------------------------------------------------------------------
// NextAuth Configuration
// ---------------------------------------------------------------------------

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // 1. Zod input validation
          const parsed = loginSchema.safeParse(credentials);
          if (!parsed.success) {
            throw new InvalidCredentialsError();
          }

          const { email, password } = parsed.data;

          // 2. Retrieve user
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            throw new UserNotFoundError();
          }

          if (!user.passwordHash) {
            // User registered via OAuth, cannot use credentials login
            throw new InvalidCredentialsError();
          }

          // 3. Password matching
          const isValid = await bcrypt.compare(password, user.passwordHash);
          if (!isValid) {
            throw new InvalidCredentialsError();
          }

          // 4. Return user details (never returning passwordHash)
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error: unknown) {
          if (error instanceof CredentialsSignin) {
            throw error;
          }
          // Log server-side errors, then throw internal error
          console.error("[NextAuth Credentials Provider] Auth failed:", error);
          throw new InternalAuthError();
        }
      },
    }),
  ],
});

