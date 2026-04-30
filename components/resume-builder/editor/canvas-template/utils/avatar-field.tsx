import { useRef } from "react";

export function AvatarField(props: {
  src?: string;
  onCommit: (dataUrl: string) => void;
}) {
  /* ----------------------------------- Props --------------------------------- */
  const { src, onCommit } = props;

  /* -------------------------------- All States ------------------------------- */
  const inputRef = useRef<HTMLInputElement | null>(null);

  /* --------------------------------- Methods --------------------------------- */
  // ── Handle File Change ─────────────────────────────────────────
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset input so re-selecting the same file triggers onChange again
    e.target.value = "";

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      // Resize + compress to max 200×200px, JPEG quality 0.7
      // to keep the base64 payload small for the backend API
      const img = new Image();
      img.onload = () => {
        const MAX = 200;
        const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
        const w = Math.round(img.width * ratio);
        const h = Math.round(img.height * ratio);
        const cvs = document.createElement("canvas");
        cvs.width = w;
        cvs.height = h;
        cvs.getContext("2d")!.drawImage(img, 0, 0, w, h);
        onCommit(cvs.toDataURL("image/jpeg", 0.7));
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div
      className="group/avatar relative shrink-0 cursor-pointer"
      style={{ width: 72, height: 72 }}
      onClick={(e) => {
        e.stopPropagation();
        inputRef.current?.click();
      }}
      title="Click to change photo"
    >
      {/* Avatar Image or Placeholder Section */}
      {src ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- avatar preview may be a base64 data URL generated on the client */}
          <img
            src={src}
            alt="Profile"
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              objectFit: "cover",
              display: "block",
              border: "2px solid #e5e7eb",
            }}
          />
        </>
      ) : (
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "#ede9fe",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px dashed #a5b4fc",
            color: "#6366f1",
            fontSize: 11,
            fontWeight: 500,
            textAlign: "center",
            lineHeight: 1.3,
            padding: 4,
          }}
        >
          Add Photo
        </div>
      )}

      {/* Hover Over Section */}
      <div
        className="absolute inset-0 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center"
        style={{
          borderRadius: "50%",
          background: "rgba(79,70,229,0.55)",
          color: "#fff",
          fontSize: 10,
          fontWeight: 600,
          textAlign: "center",
          lineHeight: 1.3,
          pointerEvents: "none",
        }}
      >
        Change
        <br />
        Photo
      </div>

      {/* Hidden File Input Section */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}
