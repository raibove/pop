import { Devvit } from "@devvit/public-api";
import { BlocksToWebviewMessage } from "../../game/shared.js";
import { WEBVIEW_ID } from "../constants.js";
import { getRandomColor} from '../../game/utils/colors.js'


export const sendMessageToWebview = (
  context: Devvit.Context,
  message: BlocksToWebviewMessage,
) => {
  context.ui.webView.postMessage(WEBVIEW_ID, message);
};

export const createNewBoard = (boardSize: number) => {
  const newBoard = Array(boardSize)
    .fill(null)
    .map(() => Array(boardSize).fill(null));

  // Fill ~40% of the board with random colors
  for (let i = 0; i < boardSize * boardSize * 0.4; i++) {
    let row, col;
    do {
      row = Math.floor(Math.random() * boardSize);
      col = Math.floor(Math.random() * boardSize);
    } while (newBoard[row][col] !== null);

    newBoard[row][col] = getRandomColor();
  }
  return newBoard;
};


export const stringifyValues = <T extends Record<string, any>>(
  obj: T,
): Record<keyof T, string> => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, String(value)]),
  ) as Record<keyof T, string>;
};