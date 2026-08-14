const SUPPORTED_PROFILE_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export function isSupportedProfileImage(file: File): boolean {
  return SUPPORTED_PROFILE_IMAGE_TYPES.has(file.type);
}

export function readImageFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("The selected image could not be read."));
    };

    reader.onerror = () => {
      reject(
        reader.error ?? new Error("The selected image could not be read."),
      );
    };

    reader.readAsDataURL(file);
  });
}
