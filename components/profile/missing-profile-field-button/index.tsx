import { Button } from "@/components/ui/button";
import { LucidePlus } from "lucide-react";
import { IMissingProfileFieldButton } from "./props";

export default function MissingProfileFieldButton(
  props: IMissingProfileFieldButton,
) {
  /* ----------------------------- Props ----------------------------- */
  const { label, onClick } = props;

  /* -------------------------- Render UI -------------------------- */
  return (
    <Button
      type="button"
      variant="outline"
      className="h-12 w-full justify-start border-dashed px-3 font-normal text-muted-foreground hover:border-foreground/35 hover:bg-muted/40 hover:text-foreground"
      onClick={onClick}
    >
      <LucidePlus className="size-[18px] shrink-0" />
      <span className="truncate">{label}</span>
    </Button>
  );
}
