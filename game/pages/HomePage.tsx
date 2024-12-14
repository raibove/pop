import { useEffect, useState } from 'react';
import { useSetPage } from '../hooks/usePage';
import { checkIfMoreMatchAvailable, checkMatch } from '../utils/gameLogic';
import { Board } from '../types';
import GameBoard from '../components/GameBoard';
import Score from '../components/Score';

export const HomePage = ({ postId, initialBoard }: { postId: string, initialBoard: Board }) => {
  const setPage = useSetPage();
  const [board, setBoard] = useState<Board>([]);
  const [score, setScore] = useState(0);
  const [moreMatchAvailable, setMoreMatchAvailable] = useState(true);
  const [hiddenTiles, setHiddenTiles] = useState<Set<string>>(new Set());

  useEffect(() => {
    setBoard(initialBoard);
    console.log('<<initial', initialBoard)
  }, [board]);

  const handleTileClick = (row: number, col:  number) => {
    const matchResult = checkMatch(board, row, col, hiddenTiles);
    if (matchResult.matched) {
      const newHiddenTiles = new Set(hiddenTiles);
      matchResult.positions!.forEach(([r, c]) => {
        newHiddenTiles.add(`${r}-${c}`);
      });
      setMoreMatchAvailable(checkIfMoreMatchAvailable(board, newHiddenTiles))
      setHiddenTiles(newHiddenTiles);
      setScore(score + matchResult.score!);
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-gray-200">
      <div className=" flex flex-col items-center justify-center">
      {!moreMatchAvailable && <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setPage('home')}>Restart</button>}
      <Score score={score} />
      <GameBoard board={board} onTileClick={handleTileClick} hiddenTiles={hiddenTiles}/>
    </div>
    </div>
  );
};