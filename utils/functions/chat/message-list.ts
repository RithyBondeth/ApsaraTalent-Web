import { IMessage } from "@/components/message/props";
import { parseMessageDate } from "@/utils/functions/chat/message-date";

export function resolveLastSeenMessageIndex(messages: IMessage[]): number {
  for (let index = messages.length - 1; index >= 0; index--) {
    if (messages[index].isMe && messages[index].isRead) return index;
  }

  return -1;
}

export function shouldShowMessageDateDivider(
  currentMessage: IMessage,
  previousMessage: IMessage | null,
): boolean {
  if (!previousMessage) return true;

  const currentDate = parseMessageDate(currentMessage.timestamp).toDateString();
  const previousDate = parseMessageDate(
    previousMessage.timestamp,
  ).toDateString();

  return currentDate !== previousDate;
}
