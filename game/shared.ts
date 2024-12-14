export type Page =
  | "home"
  | "loading";

export type WebviewToBlockMessage = { type: "INIT" };

export type BlocksToWebviewMessage = {
  type: "INIT_RESPONSE";
  payload: {
    postId: string;
    board: string;
    username: string;
    avatar: string;
  };
} | {
  type: "GET_POKEMON_RESPONSE";
  payload: { number: number; name: string; error?: string };
};

export type DevvitMessage = {
  type: "devvit-message";
  data: { message: BlocksToWebviewMessage };
};

export interface ChallengeInfo {
  board: string,
  totalPlayers: number,
}