/* --------------------------------- Method ---------------------------------- */
/**
 * Decodes a JWT token and extracts the "role" property from its payload.
 * Useful for determining user access levels in middleware or on the client edge.
 *
 * @param token - The raw JWT string
 * @returns The user's role as a string, or null if parsing fails/role is missing
 */
export function getRoleFromJwt(token: string): string | null {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;

    // Use Web APIs so it works in Next middleware (Edge runtime)
    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    if (typeof atob !== "function") return null;

    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    const payload = JSON.parse(json);

    return typeof payload?.role === "string" ? payload.role : null;
  } catch {
    return null;
  }
}
