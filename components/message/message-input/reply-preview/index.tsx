import { Button } from "@/components/ui/button";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { X } from "lucide-react";
import { IMessageReplyPreviewProps } from "./props";
import { useTranslations } from "next-intl";

export function MessageReplyPreview(props: IMessageReplyPreviewProps) {
  /* --------------------------------- Props --------------------------------- */
  const { replyTarget, replyPreviewText, onCancelReply } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("message");
  const replySenderLabel = replyTarget.isMe
    ? t("you")
    : replyTarget.senderName || t("unknown");
  const truncatedPreviewText = `${replyPreviewText.slice(0, 100)}${
    replyPreviewText.length > 100 ? "…" : ""
  }`;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="mb-2 flex items-start gap-2 px-1">
      {/* Reply Preview Section */}
      <div className="flex-1 border-primary bg-muted/40 py-1.5 pl-3 pr-2">
        {/* Reply Sender Section */}
        <TypographyP className="text-xs font-medium leading-tight text-primary [&:not(:first-child)]:mt-0">
          {replySenderLabel}
        </TypographyP>

        {/* Reply Preview Text Section */}
        <TypographyMuted className="truncate text-xs leading-snug text-muted-foreground">
          {replyTarget.isDeleted ? t("deletedMessage") : truncatedPreviewText}
        </TypographyMuted>
      </div>

      {/* Cancel Reply Button Section */}
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
        onClick={onCancelReply}
        aria-label="Cancel reply"
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
