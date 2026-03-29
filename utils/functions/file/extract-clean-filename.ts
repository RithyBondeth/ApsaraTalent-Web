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
