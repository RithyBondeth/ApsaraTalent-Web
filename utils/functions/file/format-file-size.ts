/* --------------------------------- Method ---------------------------------- */
/**
 * Converts a bare number of bytes into a readable string with unit (B, KB, MB).
 *
 * @param bytes - Size in bytes
 * @returns Human-readable file size string (e.g. "4.2 MB")
 */
export function formatFileSize(bytes?: number): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
