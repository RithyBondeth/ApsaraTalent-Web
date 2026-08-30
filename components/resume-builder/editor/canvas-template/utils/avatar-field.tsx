import { useRef } from "react";
import { RESUME_COLOR } from "@/utils/constants/resume-colors.constant";
import { useResumeTemplateTheme } from "@/hooks/resume/use-resume-template-theme";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function AvatarField(props: {
  src?: string;
  onCommit: (dataUrl: string) => void;
}) {
  /* ----------------------------------- Props --------------------------------- */
  const { src, onCommit } = props;
  const theme = useResumeTemplateTheme();
  const t = useTranslations("resumeBuilder");

  /* -------------------------------- All States ------------------------------- */
  const inputRef = useRef<HTMLInputElement | null>(null);

  /* --------------------------------- Methods --------------------------------- */
  // ── Handle File Change ─────────────────────────────────────────
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset input so re-selecting the same file triggers onChange again
    e.target.value = "";

    if (!ALLOWED_AVATAR_TYPES.has(file.type)) {
      toast.error(t("invalidImageType"));
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      toast.error(t("imageTooLarge"));
      return;
    }

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
        const context = cvs.getContext("2d");
        if (!context) {
          toast.error(t("imageReadFailed"));
          return;
        }
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, w, h);
        context.drawImage(img, 0, 0, w, h);
        onCommit(cvs.toDataURL("image/jpeg", 0.7));
      };
      img.onerror = () => toast.error(t("imageReadFailed"));
      img.src = dataUrl;
    };
    reader.onerror = () => toast.error(t("imageReadFailed"));
    reader.readAsDataURL(file);
  }

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div
      className="group/avatar relative shrink-0 cursor-pointer"
      style={{ width: theme.avatarSize, height: theme.avatarSize }}
      onClick={(e) => {
        e.stopPropagation();
        inputRef.current?.click();
      }}
      title={t("changePhotoTitle")}
    >
      {/* Avatar Image or Placeholder Section */}
      {src ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- avatar preview may be a base64 data URL generated on the client */}
          <img
            src={src}
            alt={t("profileImageAlt")}
            style={{
              width: theme.avatarSize,
              height: theme.avatarSize,
              borderRadius: theme.avatarRadius,
              objectFit: "cover",
              display: "block",
              border: `2px solid ${theme.accent}`,
            }}
          />
        </>
      ) : (
        <div
          style={{
            width: theme.avatarSize,
            height: theme.avatarSize,
            borderRadius: theme.avatarRadius,
            background: theme.accentSoft,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `2px dashed ${theme.accent}`,
            color: theme.accent,
            fontSize: 11,
            fontWeight: 500,
            textAlign: "center",
            lineHeight: 1.3,
            padding: 4,
          }}
        >
          {t("addPhoto")}
        </div>
      )}

      {/* Hover Over Section */}
      <div
        className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover/avatar:opacity-100"
        style={{
          borderRadius: theme.avatarRadius,
          background: "rgba(79,70,229,0.55)",
          color: RESUME_COLOR.WHITE,
          fontSize: 10,
          fontWeight: 600,
          textAlign: "center",
          lineHeight: 1.3,
          pointerEvents: "none",
        }}
      >
        {t("changePhoto")}
      </div>

      {/* Hidden File Input Section */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}
