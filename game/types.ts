export type Board = (string | null)[][];
export type Position = [number, number];
export type ColorGroup = {
  positions: Position[];
  count: number;
};
export type MatchResult = {
  matched: boolean;
  positions?: Position[];
  score?: number;
};

export interface LeaderboardPlayer {
  // id: string;
  username: string;
  // avatar: string;
  score: number;
  // level: number;
  // bestStreak: number;
}