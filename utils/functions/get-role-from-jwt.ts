export function getRoleFromJwt(token: string): string | null {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;

    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );

    const json = Buffer.from(padded, "base64").toString("utf-8");
    const payload = JSON.parse(json);

    return typeof payload?.role === "string" ? payload.role : null;
  } catch {
    return null;
  }
}
