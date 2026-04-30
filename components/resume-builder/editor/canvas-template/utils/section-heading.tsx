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
        color: "#4f46e5",
        borderBottom: "1.5px solid #ede9fe",
        paddingBottom: 3,
        marginTop: 18,
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  );
}
