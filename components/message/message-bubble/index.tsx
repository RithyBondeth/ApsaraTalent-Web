import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactionPicker } from "../message-utils/reaction-picker";
import { useChatStore } from "@/stores/chat.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { IMessageBubbleProps } from "./props";

export default function MessageBubble(props: IMessageBubbleProps) {
  const { message, activeChat, isLastSeen } = props;

  const { reactToMessage } = useChatStore();
  const { user: currentUser } = useGetCurrentUserStore();

  const handleReact = (emoji: string | null) => {
    reactToMessage(message.id, activeChat.id, emoji);
  };

  const myReaction = currentUser
    ? message.reactions?.[currentUser.id]
    : undefined;

  // Group user IDs by emoji
  const reactionsByEmoji = useMemo(() => {
    const grouped: Record<string, string[]> = {};
    Object.entries(message.reactions || {}).forEach(([userId, emoji]) => {
      if (!grouped[emoji]) grouped[emoji] = [];
      grouped[emoji].push(userId);
    });
    return grouped;
  }, [message.reactions]);

  const emojiList = Object.keys(reactionsByEmoji);
  const totalReactionCount = Object.keys(message.reactions || {}).length;

  const getUserName = (userId: string) => {
    if (userId === currentUser?.id) return "You";
    // In 1-on-1, the other ID must be the partner
    return activeChat.name;
  };

  return (
    <div className={`mb-4 max-w-[80%] group ${message.isMe ? "ml-auto" : ""}`}>
      {!message.isMe && (
        <div className="flex items-center mb-1">
          <Avatar className="h-6 w-6 mr-2">
            {activeChat.isGroup ? (
              <AvatarFallback>
                {message.senderId
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            ) : (
              <>
                <AvatarImage src={activeChat.avatar} alt={activeChat.name} />
                <AvatarFallback>
                  {activeChat.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </>
            )}
          </Avatar>
          <TypographyMuted>{activeChat.name}</TypographyMuted>
        </div>
      )}
      <div
        className={`flex items-center gap-2 ${message.isMe ? "flex-row-reverse" : ""}`}
      >
        <div className="relative">
          <div
            className={`p-3 rounded-2xl text-sm transition-all ${
              message.isMe
                ? "bg-primary text-primary-foreground rounded-br-none"
                : "bg-background text-foreground rounded-tl-none shadow-sm"
            }`}
          >
            {message.content}
          </div>

          {/* Reaction display badge with Detail Popover */}
          {totalReactionCount > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <div
                  className={`absolute -bottom-2 flex gap-1 bg-background/80 backdrop-blur-sm border shadow-sm rounded-full px-1.5 py-0.5 z-10 cursor-pointer hover:bg-muted transition-colors ${
                    message.isMe ? "right-0" : "left-0"
                  }`}
                >
                  {Object.entries(reactionsByEmoji).map(([emoji, userIds]) => (
                    <div key={emoji} className="flex items-center gap-0.5">
                      <span className="text-xs leading-none">{emoji}</span>
                      {userIds.length > 1 && (
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {userIds.length}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0 overflow-hidden" side="top">
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="w-full justify-start h-10 bg-muted/50 rounded-none border-b px-2 gap-2 overflow-x-auto no-scrollbar">
                    <TabsTrigger
                      value="all"
                      className="text-xs h-7 px-2 data-[state=active]:bg-background"
                    >
                      All {totalReactionCount}
                    </TabsTrigger>
                    {emojiList.map((emoji) => (
                      <TabsTrigger
                        key={emoji}
                        value={emoji}
                        className="text-xs h-7 px-2 data-[state=active]:bg-background"
                      >
                        {emoji} {reactionsByEmoji[emoji].length}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <div className="max-h-48 overflow-y-auto p-2">
                    <TabsContent value="all" className="mt-0 outline-none">
                      <div className="space-y-2">
                        {Object.entries(message.reactions || {}).map(
                          ([userId, emoji]) => (
                            <div
                              key={userId}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  {userId === currentUser?.id ? (
                                    <>
                                      <AvatarImage
                                        src={
                                          currentUser?.employee?.avatar ||
                                          currentUser?.company?.avatar
                                        }
                                      />
                                      <AvatarFallback className="text-[10px]">
                                        ME
                                      </AvatarFallback>
                                    </>
                                  ) : (
                                    <>
                                      <AvatarImage src={activeChat.avatar} />
                                      <AvatarFallback className="text-[10px]">
                                        {activeChat.name[0]}
                                      </AvatarFallback>
                                    </>
                                  )}
                                </Avatar>
                                <span className="text-sm font-medium">
                                  {getUserName(userId)}
                                </span>
                              </div>
                              <span className="text-lg">{emoji}</span>
                            </div>
                          ),
                        )}
                      </div>
                    </TabsContent>
                    {emojiList.map((emoji) => (
                      <TabsContent
                        key={emoji}
                        value={emoji}
                        className="mt-0 outline-none"
                      >
                        <div className="space-y-2">
                          {reactionsByEmoji[emoji].map((userId) => (
                            <div
                              key={userId}
                              className="flex items-center gap-2"
                            >
                              <Avatar className="h-6 w-6">
                                {userId === currentUser?.id ? (
                                  <>
                                    <AvatarImage
                                      src={
                                        currentUser?.employee?.avatar ||
                                        currentUser?.company?.avatar
                                      }
                                    />
                                    <AvatarFallback className="text-[10px]">
                                      ME
                                    </AvatarFallback>
                                  </>
                                ) : (
                                  <>
                                    <AvatarImage src={activeChat.avatar} />
                                    <AvatarFallback className="text-[10px]">
                                      {activeChat.name[0]}
                                    </AvatarFallback>
                                  </>
                                )}
                              </Avatar>
                              <span className="text-sm font-medium">
                                {getUserName(userId)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </div>
                </Tabs>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Reaction picker button */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <ReactionPicker onReact={handleReact} currentReaction={myReaction} />
        </div>
      </div>

      <div
        className={`text-[10px] text-muted-foreground mt-1.5 ${message.isMe ? "text-right" : ""}`}
      >
        {message.timestamp instanceof Date
          ? message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
      </div>

      {/* Seen indicator — only under the last sent message that was read */}
      {isLastSeen && (
        <div className="flex items-center justify-end gap-1 mt-1">
          <Avatar className="h-4 w-4">
            <AvatarImage src={activeChat.avatar} alt={activeChat.name} />
            <AvatarFallback className="text-[8px]">
              {activeChat.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="text-[10px] text-muted-foreground">Seen</span>
        </div>
      )}
    </div>
  );
}
