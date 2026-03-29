import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

interface IRemoveAlertDialog {
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
}

export default function RemoveAlertDialog(props: IRemoveAlertDialog) {
  /* ---------------------------------- Props ---------------------------------- */
  const { type, openDialog, setOpenDialog, onNoClick, onYesClick } = props;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this {type}?
        </DialogDescription>
        <DialogFooter>
          <Button variant={"outline"} type="button" onClick={onNoClick}>
            No
          </Button>
          <Button type="button" variant={"destructive"} onClick={onYesClick}>
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
