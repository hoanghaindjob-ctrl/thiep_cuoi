/**
 * Shared-password gate for the studio.
 *
 * The cookie holds a SHA-256 of the password rather than the password itself,
 * so a stolen cookie does not hand over the secret. Web Crypto is used instead
 * of node:crypto because middleware runs on the edge runtime.
 */
export const STUDIO_COOKIE = "vow-studio";

export async function sessionToken(password: string): Promise<string> {
  const bytes = new TextEncoder().encode(`vow-studio:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Compares without leaking where the strings diverge. */
export function sameToken(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function expectedToken(): Promise<string | null> {
  const password = process.env.STUDIO_PASSWORD;
  if (!password) return null;
  return sessionToken(password);
}
