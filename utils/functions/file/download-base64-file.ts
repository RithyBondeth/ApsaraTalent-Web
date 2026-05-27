export function downloadBase64File(
  data: string,
  mimeType: string,
  filename: string,
): void {
  const bytes = new Uint8Array(Array.from(atob(data), (c) => c.charCodeAt(0)));
  const blob = new Blob([bytes], { type: mimeType });
  const a = document.createElement("a");
  const objectUrl = window.URL.createObjectURL(blob);
  a.href = objectUrl;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(objectUrl);
}
