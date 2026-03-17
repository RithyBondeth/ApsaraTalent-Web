import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle
} from "@/components/ui/dialog";

export default function RemoveAlertDialog(props: {
  type:
    | "experience"
    | "education"
    | "avatar"
    | "cover"
    | "image"
    | "resume"
    | "coverLetter"
    | "position";
  openDialog: boolean;
  setOpenDialog: (onRemoveOpDialog: boolean) => void;
  onNoClick: () => void;
  onYesClick: () => void;
}) {
  return (
    <Dialog open={props.openDialog} onOpenChange={props.setOpenDialog}>
      <DialogContent>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this {props.type}?
        </DialogDescription>
        <DialogFooter>
          <Button variant={"outline"} type="button" onClick={props.onNoClick}>
            No
          </Button>
          <Button
            type="button"
            variant={"destructive"}
            onClick={props.onYesClick}
          >
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
