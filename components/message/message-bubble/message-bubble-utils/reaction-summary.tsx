import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ReactionSummary(props: {
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
}) {
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

  /* -------------------------------- Null State ------------------------------- */
  if (!isVisible) return null;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <Popover>
      {/* Trigger Reaction Section */}
      <PopoverTrigger asChild>
        {/* Reaction Badge Section */}
        <div
          className={`absolute -bottom-2 z-10 flex cursor-pointer gap-1 border bg-background/90 px-1.5 py-0.5 shadow-sm backdrop-blur-sm transition-colors hover:bg-muted ${badgePositionClass}`}
        >
          {Object.entries(reactionsByEmoji).map(([emoji, userIds]) => (
            <div key={emoji} className="flex items-center gap-0.5">
              <span className="text-xs leading-none">{emoji}</span>
              {userIds.length > 1 && (
                <span className="text-[10px] font-medium text-muted-foreground">
                  {userIds.length}
                </span>
              )}
            </div>
          ))}
        </div>
      </PopoverTrigger>

      {/* Content Reaction Section */}
      <PopoverContent className="w-64 overflow-hidden p-0" side="top">
        <Tabs defaultValue="all" className="w-full">
          {/* Tabs List Section */}
          <TabsList className="no-scrollbar h-10 w-full justify-start gap-2 overflow-x-auto border-b bg-muted/50 px-2">
            <TabsTrigger
              value="all"
              className="h-7 px-2 text-xs data-[state=active]:bg-background"
            >
              All {totalReactionCount}
            </TabsTrigger>
            {emojiList.map((emoji) => (
              <TabsTrigger
                key={emoji}
                value={emoji}
                className="h-7 px-2 text-xs data-[state=active]:bg-background"
              >
                {emoji} {reactionsByEmoji[emoji].length}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tabs Content Section */}
          <div className="max-h-48 overflow-y-auto p-2">
            <TabsContent value="all" className="mt-0 outline-none">
              <div className="space-y-2">
                {/* All Reaction Entries Section */}
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

            {/* Emoji Tabs Content Section */}
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
