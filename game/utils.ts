import { WebviewToBlockMessage } from "./shared";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getRandomColor } from "./utils/colors";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sendToDevvit(event: WebviewToBlockMessage) {
  window.parent?.postMessage(event, "*");
}

export function rand(min: number, max: number | undefined) {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return Math.random() * (max - min) + min;
}
