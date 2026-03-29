import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MessageReactionSummaryProps {
  isVisible: boolean;
  isMe: boolean;
  totalReactionCount: number;
  emojiList: string[];
  reactionsByEmoji: Record<string, string[]>;
  reactionEntries: Array<[string, string]>;
  currentUserId?: string;
  currentUserAvatar?: string;
  activeChatAvatar: string;
  activeChatName: string;
  getUserName: (userId: string) => string;
}

export function MessageReactionSummary(props: MessageReactionSummaryProps) {
  /* --------------------------------- Props --------------------------------- */
  const {
    isVisible,
    isMe,
    totalReactionCount,
    emojiList,
    reactionsByEmoji,
    reactionEntries,
    currentUserId,
    currentUserAvatar,
    activeChatAvatar,
    activeChatName,
    getUserName,
  } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const badgePositionClass = isMe ? "right-0" : "left-0";
  const activeChatInitial = activeChatName[0] ?? "?";

  if (!isVisible) return null;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={`absolute -bottom-2 flex gap-1 bg-background/80 backdrop-blur-sm border shadow-sm rounded-full px-1.5 py-0.5 z-10 cursor-pointer hover:bg-muted transition-colors ${badgePositionClass}`}
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
                {reactionEntries.map(([userId, emoji]) => (
                  <div
                    key={userId}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        {userId === currentUserId ? (
                          <>
                            <AvatarImage src={currentUserAvatar} />
                            <AvatarFallback className="text-[10px]">
                              ME
                            </AvatarFallback>
                          </>
                        ) : (
                          <>
                            <AvatarImage src={activeChatAvatar} />
                            <AvatarFallback className="text-[10px]">
                              {activeChatInitial}
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
                ))}
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
                    <div key={userId} className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        {userId === currentUserId ? (
                          <>
                            <AvatarImage src={currentUserAvatar} />
                            <AvatarFallback className="text-[10px]">
                              ME
                            </AvatarFallback>
                          </>
                        ) : (
                          <>
                            <AvatarImage src={activeChatAvatar} />
                            <AvatarFallback className="text-[10px]">
                              {activeChatInitial}
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
  );
}
