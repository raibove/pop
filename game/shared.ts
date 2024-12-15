export type Page =
  | "home"
  | "loading";

export type WebviewToBlockMessage = { type: "INIT" } |
{type: "UPDATE_SCORE",
  payload: {
    score: number,
    hiddenTiles: string,
    isGameOver: boolean 
  }
};

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