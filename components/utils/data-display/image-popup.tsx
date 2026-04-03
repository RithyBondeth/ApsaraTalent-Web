import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

export default function ImagePopup(props: {
  image: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogContent className="w-fit p-0 border-0">
        <DialogHeader className="hidden">
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>
        <Image
          src={props.image}
          alt="Image"
          width={1600}
          height={1200}
          className="rounded-lg h-auto w-auto max-h-[85vh] max-w-[90vw]"
          unoptimized
        />
      </DialogContent>
    </Dialog>
  );
}
