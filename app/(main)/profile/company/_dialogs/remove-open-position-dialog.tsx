import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

export default function RemoveOpenPositionDialog(props: {
  onRemoveOpDialog: boolean;
  setOnRemoveOpDialog: (onRemoveOpDialog: boolean) => void;
  onNoClick: () => void;
  onYesClick: () => void;
}) {
  return (
    <Dialog
      open={props.onRemoveOpDialog}
      onOpenChange={props.setOnRemoveOpDialog}
    >
      <DialogContent>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this open position?
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
