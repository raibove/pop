export type Page =
  | "home"
  | "loading"
  | "userChoice"
  // | "gameOver"
  | "leaderboard"
  ;

export type WebviewToBlockMessage = { type: "INIT" } |
{type: "UPDATE_SCORE",
  payload: {
    score: number,
    hiddenTiles: string,
    isGameOver: boolean 
  }
} | 
{
  type: 'CREATE_NEW_GAME',
}
;

export type BlocksToWebviewMessage = {
  type: "INIT_RESPONSE";
  payload: {
    postId: string;
    board: string;
    username: string;
    avatar: string;
    appWidth?: number;
    hiddenTiles: string;
    score: number;
    isGameOver: boolean;
  };
};

export type DevvitMessage = {
  type: "devvit-message";
  data: { message: BlocksToWebviewMessage };
};

export interface ChallengeInfo {
  board: string,
  totalPlayers: number,
}