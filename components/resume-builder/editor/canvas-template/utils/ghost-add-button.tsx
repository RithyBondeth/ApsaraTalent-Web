import { Plus } from "lucide-react";
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
      className="group/add flex items-center gap-1 opacity-0 group-hover/section:opacity-100 transition-opacity duration-150 mt-2"
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
      <Plus size={11} />
      {label}
    </button>
  );
}
