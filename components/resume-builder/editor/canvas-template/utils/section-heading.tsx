import { RESUME_COLOR } from "@/utils/constants/resume-colors.constant";

export function SectionHeading(props: { children: React.ReactNode }) {
  /* ----------------------------------- Props --------------------------------- */
  const { children } = props;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: RESUME_COLOR.ACCENT,
        borderBottom: `1.5px solid ${RESUME_COLOR.ACCENT_LIGHT}`,
        paddingBottom: 3,
        marginTop: 18,
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  );
}
