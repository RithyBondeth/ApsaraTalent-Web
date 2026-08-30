import { Button } from "@/components/ui/button";
import { LucideCircleCheck, LucideLoader2 } from "lucide-react";
import type { IProfileEditActionBarProps } from "./props";

export default function ProfileEditActionBar({
  cancelLabel,
  editLabel,
  isSaving,
  saveLabel,
  savingLabel,
  onCancel,
}: IProfileEditActionBarProps) {
  return (
    <div className="profile-edit-bar sticky top-14 z-40 -mx-3 flex items-center justify-between gap-3 border-b border-border bg-background/95 px-4 py-2.5 backdrop-blur-md sm:-mx-4 sm:px-5 lg:-mx-6">
      {/* Edit Profile Status Section */}
      <div className="flex items-center gap-2">
        <span className="relative flex size-1.5" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-50" />
          <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
        </span>
        <span className="text-sm font-medium">{editLabel}</span>
      </div>

      {/* Edit Profile Action Buttons Section */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 text-xs"
          onClick={onCancel}
        >
          {cancelLabel}
        </Button>
        <Button
          type="submit"
          size="sm"
          className="h-8 min-w-[80px] text-xs"
          disabled={isSaving}
        >
          {isSaving ? (
            <LucideLoader2 className="size-3.5 animate-spin" />
          ) : (
            <LucideCircleCheck className="size-3.5" />
          )}
          {isSaving ? savingLabel : saveLabel}
        </Button>
      </div>
    </div>
  );
}
