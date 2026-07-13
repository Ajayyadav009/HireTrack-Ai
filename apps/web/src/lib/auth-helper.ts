import { auth } from "@/auth";

/**
 * Retrieves the authenticated session in Server Components and Server Actions.
 */
export async function getAuthSession() {
  return await auth();
}

/**
 * Asserts the existence of an authenticated session and returns it,
 * throwing an error if the user is unauthenticated.
 */
export async function requireAuth() {
  const session = await getAuthSession();
  if (!session || !session.user) {
    throw new Error("Unauthorized: Authentication required.");
  }
  return session;
}
