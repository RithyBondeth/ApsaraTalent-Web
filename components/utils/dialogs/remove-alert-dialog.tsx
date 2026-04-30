"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";

/* ----------------------------------- Helper ---------------------------------- */
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

  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("dialog");

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent>
        <DialogTitle>{t("areYouSure")}</DialogTitle>
        <DialogDescription>
          {t("deleteConfirm", { type })}
        </DialogDescription>
        <DialogFooter>
          <Button variant={"outline"} type="button" onClick={onNoClick}>
            {t("no")}
          </Button>
          <Button type="button" variant={"destructive"} onClick={onYesClick}>
            {t("yes")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
