export interface IWeeklyActivity {
  day: string;
  likes: number;
  received: number;
  matches: number;
}

export interface IRecentMatch {
  id: string;
  name: string;
  avatar: string;
  matchScore: number;
  matchDate: string;
}
