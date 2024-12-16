import { useEffect, useState } from 'react';
import { useSetPage } from '../hooks/usePage';
import { checkIfMoreMatchAvailable, checkMatch } from '../utils/gameLogic';
import { Board } from '../types';
import GameBoard from '../components/GameBoard';
import { sendToDevvit } from '../utils';
import { GameOver } from '../components/GameOver';
import { ChartColumnDecreasing, Music } from 'lucide-react'
import { motion } from 'motion/react';
import useSound from 'use-sound';
import PopSound from './pop_sound.flac';
import { i } from 'motion/react-client';

export const HomePage = ({ postId, initialBoard, tileWidth, initialHiddenTiles, initialScore, attemptNumber }:
  { postId: string, initialBoard: Board, tileWidth: number, initialHiddenTiles: string, initialScore: number, attemptNumber: null | number }) => {
  const setPage = useSetPage();
  const [board, setBoard] = useState<Board>([]);
  const [score, setScore] = useState(0);
  const [numberOfClicks, setNumberOfClicks] = useState(0);
  const [isSoundOn, setIsSoundOn] = useState(true);

  const [playbackRate, setPlaybackRate] = useState(0.75);

  const [moreMatchAvailable, setMoreMatchAvailable] = useState(true);
  const [hiddenTiles, setHiddenTiles] = useState<Set<string>>(new Set());
  const [play] = useSound(PopSound, {
    playbackRate,
    volume: 0.5,
  });

  const handleClick = () => {
    if (!isSoundOn) return;
    setPlaybackRate(playbackRate + 0.1);
    play();
  };


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
      handleClick();
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
      <div className="flex flex-col items-center justify-center">
        {!moreMatchAvailable && <GameOver score={score} onCheckLeadboard={() => setPage('leaderboard')} />}
        <div className="flex items-center gap-4 justify-between w-1/2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl text-gray-800 bg-white/50 px-3 py-1 rounded-full shadow-sm">
              Score: {score}
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <div className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all 
            border border-slate-300 hover:border-indigo-400 
            shadow-sm hover:shadow-md group cursor-pointer"
                onClick={() => setPage('leaderboard')}
              >
                <ChartColumnDecreasing
                  className="text-yellow-500 group-hover:text-yellow-600 transition-colors"
                  size={24}
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all 
            border border-slate-300 hover:border-indigo-400 
            shadow-sm hover:shadow-md group cursor-pointer
            ${isSoundOn
                    ? 'text-blue-500 hover:text-blue-600'
                    : 'text-gray-400 hover:text-gray-500'}`}
                onClick={() => setIsSoundOn(!isSoundOn)}
              >
                <Music
                  className="transition-colors"
                  size={24}
                />
              </motion.div>
            </div>
          </div>
        </div>
        <GameBoard board={board} onTileClick={handleTileClick} hiddenTiles={hiddenTiles} tileWidth={tileWidth} />
      </div>
    </div>
  );
};
