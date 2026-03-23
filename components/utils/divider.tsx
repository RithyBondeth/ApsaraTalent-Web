import { cn } from "@/lib/utils";

export default function Divider(props: { className?: string }) {
  return <div className={cn("w-full h-px bg-muted", props.className)} />;
}
