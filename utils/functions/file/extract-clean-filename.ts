/* --------------------------------- Methods ---------------------------------- */
/**
 * Extracts a human-readable filename from a storage URL and cleans up any unique identifiers.
 * E.g., drops "-123434" suffixes from PDF files appended by the storage system.
 *
 * @param url - The full storage URL or filepath
 * @returns Cleaned filename string
 */
export function extractCleanFilename(url: string): string {
  try {
    const filename = url.split("/").pop() || "";
    if (!filename.toLowerCase().endsWith(".pdf")) {
      return filename; // return as-is if not PDF
    }
    return filename.replace(/^(.+?)(-\d+)*?(\.pdf)$/i, "$1$3");
  } catch {
    return "";
  }
}
