import { Board, ColorGroup, MatchResult, Position } from "../types";

/*
board[row][col] && !hiddenTiles.has(`${row}-${col}`)
this line checks if the tile exist and is not hidden
If it is visible, means user clicked on a colored tile, so that click won't count.

*/

const directions: Position[] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
]; // up, down, left, right

export const checkIfMoreMatchAvailable = (board: Board, hiddenTiles: Set<string>): boolean => {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[0].length; col++) {
      if(checkMatch(board, row, col, hiddenTiles).matched) return true;
    }
  }
  return false;
};

export const checkMatch = (board: Board, row: number, col: number, hiddenTiles: Set<string>): MatchResult => {
  if (board[row][col] && !hiddenTiles.has(`${row}-${col}`)) return { matched: false };

  const nearestTiles: string[] = [];
  const tilePositions: Position[] = [];

  // Find all adjacent tiles
  for (const [dx, dy] of directions) {
    let newRow = row + dx;
    let newCol = col + dy;

    while (
      newRow >= 0 &&
      newRow < board.length &&
      newCol >= 0 &&
      newCol < board[0].length
    ) {
      if (board[newRow][newCol] && !hiddenTiles.has(`${newRow}-${newCol}`)) {
        nearestTiles.push(board[newRow][newCol]!);
        tilePositions.push([newRow, newCol]);
        break;
      }
      newRow += dx;
      newCol += dy;
    }
  }

  if (nearestTiles.length < 2) return { matched: false };

  // Group tiles by color
  const colorGroups: Record<string, ColorGroup> = {};
  nearestTiles.forEach((color, index) => {
    if (!colorGroups[color]) {
      colorGroups[color] = {
        positions: [tilePositions[index]],
        count: 1
      };
    } else {
      colorGroups[color].positions.push(tilePositions[index]);
      colorGroups[color].count++;
    }
  });

  // Check for matches
  let matchedPositions: Position[] = [];
  let matchCount = 0;

  // Check for groups of 3 or more of the same color
  Object.values(colorGroups).forEach(group => {
    if (group.count >= 3) {
      matchedPositions.push(...group.positions);
      matchCount = group.count;
    }
  });

  // If no triple match, check for two pairs
  if (matchCount === 0) {
    Object.values(colorGroups).forEach(group => {
      if (group.count >= 2) {
        matchedPositions.push(...group.positions);
        matchCount += group.count;
      }
    });
  }

  if (matchedPositions.length >= 2) {
    return {
      matched: true,
      positions: matchedPositions,
      score: matchCount
    };
  }

  return { matched: false };
};
