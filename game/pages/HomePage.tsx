import { useEffect, useState } from 'react';
import { useSetPage } from '../hooks/usePage';
import { checkIfMoreMatchAvailable, checkMatch } from '../utils/gameLogic';
import { Board } from '../types';
import GameBoard from '../components/GameBoard';
import Score from '../components/Score';
import { sendToDevvit } from '../utils';
import { GameOver } from '../components/GameOver';
// const MAX_ALLOWED_TIME = 

export const HomePage = ({ postId, initialBoard, tileWidth, initialHiddenTiles, initialScore, attemptNumber }:
  { postId: string, initialBoard: Board, tileWidth: number, initialHiddenTiles: string, initialScore: number, attemptNumber: null | number }) => {
  const setPage = useSetPage();
  const [board, setBoard] = useState<Board>([]);
  const [score, setScore] = useState(0);
  const [numberOfClicks, setNumberOfClicks] = useState(0);

  const [moreMatchAvailable, setMoreMatchAvailable] = useState(true);
  const [hiddenTiles, setHiddenTiles] = useState<Set<string>>(new Set());

  useEffect(() => {
    setBoard(initialBoard);
    const formattedHiddenTiles = new Set(initialHiddenTiles.split(', ').filter(tile => tile !== ''));
    setHiddenTiles(formattedHiddenTiles);
    setScore(initialScore);
  }, [initialBoard]);

  const handleTileClick = (row: number, col: number) => {
    setNumberOfClicks(prevNumberClick => prevNumberClick + 1);
    const matchResult = checkMatch(board, row, col, hiddenTiles);
    if (matchResult.matched) {
      const newHiddenTiles = new Set(hiddenTiles);
      matchResult.positions!.forEach(([r, c]) => {
        newHiddenTiles.add(`${r}-${c}`);
      });
      const isMoreMatchAvailable = checkIfMoreMatchAvailable(board, newHiddenTiles);
      if (!isMoreMatchAvailable) {
        setTimeout(() => {
          setMoreMatchAvailable(isMoreMatchAvailable)
        }, 5000)
      }
      setHiddenTiles(newHiddenTiles);
      setScore(score + matchResult.score!);
      sendToDevvit({
        type: 'UPDATE_SCORE',
        payload: {
          score: score + matchResult.score!,
          hiddenTiles: Array.from(newHiddenTiles).join(','),
          isGameOver: !isMoreMatchAvailable,
          attemptNumber: attemptNumber ?? 0
        }
      })
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-gray-200">
      <div className=" flex flex-col items-center justify-center">
        {!moreMatchAvailable && <GameOver score={score} onCheckLeadboard={() => setPage('leaderboard')} />}
        <Score score={score} />
        <GameBoard board={board} onTileClick={handleTileClick} hiddenTiles={hiddenTiles} tileWidth={tileWidth} />
      </div>
    </div>
  );
};