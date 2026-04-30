import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { IChatPreview } from "@/utils/interfaces/chat/chat.interface";
import { CHAT_TYPING_INDICATOR_STYLES } from "@/utils/constants/chat.constant";

export function ChatTypingIndicator(props: { activeChat: IChatPreview }) {
  /* --------------------------------- Props --------------------------------- */
  const { activeChat } = props;
  const { avatar, name } = activeChat;

  /* ---------------------------------- Utils --------------------------------- */
  const initials = name
    .split(" ")
    .map((namePart) => namePart[0])
    .join("")
    .toUpperCase();

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="mb-4 flex items-end gap-2">
      <div className="flex flex-col items-start gap-1">
        {/* Avatar Section */}
        <div className="flex items-start justify-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <TypographyMuted>{name}</TypographyMuted>
        </div>

        {/* Typing Animation Section */}
        <div className="bg-background text-foreground rounded-lg rounded-tl-none shadow-sm px-4 py-3 flex items-center gap-1">
          <style>{CHAT_TYPING_INDICATOR_STYLES}</style>
          <span className="typing-dot w-2 h-2 rounded-full bg-primary inline-block" />
          <span className="typing-dot w-2 h-2 rounded-full bg-primary inline-block" />
          <span className="typing-dot w-2 h-2 rounded-full bg-primary inline-block" />
        </div>

        {/* Typing Label Section */}
        <TypographyMuted className="text-[10px]">typing...</TypographyMuted>
      </div>
    </div>
  );
}
