import { LucidePlus } from "lucide-react";
import { RESUME_COLOR } from "@/utils/constants/resume-colors.constant";

export function GhostAddButton(props: { label: string; onClick: () => void }) {
  /* ----------------------------------- Props --------------------------------- */
  const { label, onClick } = props;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="group/add mt-2 flex items-center gap-1 opacity-0 transition-opacity duration-150 group-hover/section:opacity-100"
      style={{
        fontSize: 11,
        color: RESUME_COLOR.ACCENT,
        border: `1.5px dashed ${RESUME_COLOR.ACCENT_GHOST}`,
        borderRadius: 6,
        padding: "3px 10px",
        background: "transparent",
        cursor: "pointer",
        width: "100%",
        justifyContent: "center",
      }}
    >
      <LucidePlus size={11} />
      {label}
    </button>
  );
}
