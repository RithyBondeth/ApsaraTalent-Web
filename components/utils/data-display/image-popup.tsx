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
      <DialogContent className="w-fit rounded-none border-0 p-0 sm:rounded-none [&>button]:rounded-none">
        <DialogHeader className="hidden">
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>
        <Image
          src={props.image}
          alt="Image"
          width={1600}
          height={1200}
          className="h-auto w-auto max-h-[85vh] max-w-[90vw] rounded-none"
          unoptimized
        />
      </DialogContent>
    </Dialog>
  );
}
