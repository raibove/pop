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
    isGameOver: boolean,
    attemptNumber: number,
  }
} | {
  type: 'CREATE_NEW_GAME',
} | {
  type: 'PLAY_AGAIN',
  payload: {
    attemptNumber: number,
  }
}|{
  type: "GET_LEADERBOARD";
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
    attemptNumber: number;
  };
} | {
  type: 'PLAY_AGAIN_CONFIGURED';
  payload: {
    newAttemptNumber: number;
  }
}|
{
  type: "LEADERBOARD_SCORE";
  payload: {
   leaderboard: {member: string, score: number}[]
  }
}
;

export type DevvitMessage = {
  type: "devvit-message";
  data: { message: BlocksToWebviewMessage };
};

export interface ChallengeInfo {
  board: string,
  totalPlayers: number,
}