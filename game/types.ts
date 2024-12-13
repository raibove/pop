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
