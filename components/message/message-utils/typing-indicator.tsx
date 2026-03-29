import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { IChatPreview } from "../props";

const TYPING_INDICATOR_STYLES = `
  @keyframes typing-bounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
    40% { transform: translateY(-5px); opacity: 1; }
  }

  .typing-dot { animation: typing-bounce 1.2s infinite ease-in-out; }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }
`;

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
        <div className="flex items-start justify-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <TypographyMuted>{name}</TypographyMuted>
        </div>

        <div className="bg-background text-foreground rounded-lg rounded-tl-none shadow-sm px-4 py-3 flex items-center gap-1">
          <style>{TYPING_INDICATOR_STYLES}</style>
          <span className="typing-dot w-2 h-2 rounded-full bg-primary inline-block" />
          <span className="typing-dot w-2 h-2 rounded-full bg-primary inline-block" />
          <span className="typing-dot w-2 h-2 rounded-full bg-primary inline-block" />
        </div>

        <TypographyMuted className="text-[10px]">typing...</TypographyMuted>
      </div>
    </div>
  );
}
