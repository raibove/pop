import { useEffect, useState } from 'react';
import { useSetPage } from '../hooks/usePage';
import { getRandomColor } from '../utils/colors';
import { checkMatch } from '../utils/gameLogic';
import { Board } from '../types';
import GameBoard from '../components/GameBoard';
import Score from '../components/Score';

const BOARD_SIZE = 12;

export const HomePage = ({ postId }: { postId: string }) => {
  const setPage = useSetPage();
  const [board, setBoard] = useState<Board>([]);
  const [score, setScore] = useState(0);
  const [hiddenTiles, setHiddenTiles] = useState<Set<string>>(new Set());

  useEffect(() => {
    initializeBoard();
  }, []);

  const initializeBoard = () => {
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

    setBoard(newBoard);
  };

  const handleTileClick = (row: number, col:  number) => {
    const matchResult = checkMatch(board, row, col, hiddenTiles);
    console.log('<< row, col', row, col, matchResult)
    
    if (matchResult.matched) {
      const newBoard = [...board];
      // Remove all matching tiles
      matchResult.positions!.forEach(([r, c]) => {
        // newBoard[r][c] = null;
        setHiddenTiles(prev => new Set([...prev, `${r}-${c}`]));
      });
      setBoard(newBoard);
      setScore(score + matchResult.score!);
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-gray-200">
      <div className=" flex flex-col items-center justify-center">
      <Score score={score} />
      <GameBoard board={board} onTileClick={handleTileClick} hiddenTiles={hiddenTiles}/>
    </div>
    </div>
  );
};