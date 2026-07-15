import { useResumeTemplateTheme } from "../resume-template-theme";

export function SectionHeading(props: { children: React.ReactNode }) {
  /* ----------------------------------- Props --------------------------------- */
  const { children } = props;
  const theme = useResumeTemplateTheme();

  /* ---------------------------------- Helper --------------------------------- */
  const style: React.CSSProperties = {
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: theme.accent,
    paddingBottom: 3,
    marginTop: Math.max(12, theme.sectionGap - 6),
    marginBottom: 8,
  };

  if (theme.sectionStyle === "line") {
    style.borderBottom = `1.5px solid ${theme.accentSoft}`;
  } else if (theme.sectionStyle === "bar") {
    style.padding = "6px 9px";
    style.color = theme.background;
    style.background = theme.accent;
    style.borderRadius = theme.radius;
  } else if (theme.sectionStyle === "pill") {
    style.display = "inline-block";
    style.padding = "5px 11px";
    style.background = theme.accentSoft;
    style.borderRadius = theme.chipRadius;
  }

  /* -------------------------------- Render UI -------------------------------- */
  return <div style={style}>{children}</div>;
}
