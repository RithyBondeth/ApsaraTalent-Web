/* --------------------------------- Methods ---------------------------------- */
export function parseMaybeDate(input?: string | null): Date | undefined {
  if (!input || typeof input !== "string") return undefined;

  if (input.includes("/")) {
    // DD/MM/YYYY
    const [d, m, y] = input.split("/").map(Number);
    if (!d || !m || !y) return undefined;
    return new Date(y, m - 1, d);
  }

  const dt = new Date(input);
  return Number.isNaN(dt.getTime()) ? undefined : dt;
}
