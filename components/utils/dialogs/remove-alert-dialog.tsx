"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
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
  const itemLabels = {
    experience: t("items.experience"),
    education: t("items.education"),
    avatar: t("items.avatar"),
    cover: t("items.cover"),
    image: t("items.image"),
    resume: t("items.resume"),
    coverLetter: t("items.coverLetter"),
    position: t("items.position"),
  } as const;
  const itemLabel = itemLabels[type];

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="max-w-md rounded-none border-border/70 p-0 shadow-2xl sm:rounded-none [&>button]:right-4 [&>button]:top-4 [&>button]:rounded-none">
        <div className="h-1 w-20 bg-destructive" />

        <DialogHeader className="flex-row items-start gap-4 space-y-0 px-6 pb-6 pt-5 text-left">
          <div className="flex size-12 shrink-0 items-center justify-center border border-destructive/25 bg-destructive/10 text-destructive">
            <Trash2 className="size-5" />
          </div>

          <div className="min-w-0 space-y-2 pr-8">
            <DialogTitle className="text-xl font-bold leading-tight tracking-tight">
              {t("removeTitle", { type: itemLabel })}
            </DialogTitle>
            <DialogDescription className="leading-6">
              {t("removeDescription", { type: itemLabel })}
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="gap-2 border-t border-border/70 bg-muted/30 px-6 py-4 sm:space-x-0">
          <Button
            variant="outline"
            type="button"
            className="min-w-24 rounded-none"
            onClick={onNoClick}
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="min-w-24 rounded-none"
            onClick={onYesClick}
          >
            <Trash2 className="size-4" />
            {t("remove")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
