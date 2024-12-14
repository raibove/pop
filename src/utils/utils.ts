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

export const BOARD_SIZE = 12;

export const createNewBoard = () => {
  const newBoard = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));

  // Fill ~40% of the board with random colors
  for (let i = 0; i < BOARD_SIZE * BOARD_SIZE * 0.4; i++) {
    let row, col;
    do {
      row = Math.floor(Math.random() * BOARD_SIZE);
      col = Math.floor(Math.random() * BOARD_SIZE);
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