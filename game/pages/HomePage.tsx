import { useEffect, useState } from 'react';
import { useSetPage } from '../hooks/usePage';
import { checkMatch } from '../utils/gameLogic';
import { Board } from '../types';
import GameBoard from '../components/GameBoard';
import Score from '../components/Score';

export const HomePage = ({ postId, initialBoard }: { postId: string, initialBoard: Board }) => {
  const setPage = useSetPage();
  const [board, setBoard] = useState<Board>([]);
  const [score, setScore] = useState(0);
  const [hiddenTiles, setHiddenTiles] = useState<Set<string>>(new Set());

  useEffect(() => {
    setBoard(initialBoard);
  }, [board]);

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