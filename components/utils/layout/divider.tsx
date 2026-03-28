import { cn } from "@/lib/utils";

export default function Divider(props: { className?: string }) {
  /* -------------------------------- Render UI -------------------------------- */
  return <div className={cn("w-full h-px bg-muted", props.className)} />;
}
