export interface IWeeklyActivity {
  day: string;
  likes: number;
  received: number;
  matches: number;
}

export interface IRecentMatch {
  id: string;
  name: string;
  avatar: string | null;
  matchedAt: string;
}
