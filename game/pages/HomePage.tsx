import { ComponentProps, useEffect, useState } from 'react';
import { useSetPage } from '../hooks/usePage';
import { cn, rand } from '../utils';
import ParticleEffectButton from '../components/ParticleEffect';
import { getRandomColor } from '../utils/colors';
import { checkMatch } from '../utils/gameLogic';
import { Board } from '../types';
import GameBoard from '../components/GameBoard';
import Score from '../components/Score';

const BOARD_SIZE = 12;

export const HomePage = ({ postId }: { postId: string }) => {
  const setPage = useSetPage();
  const [hidden, setHidden] = useState(false);
  const [board, setBoard] = useState<Board>([]);
  const [score, setScore] = useState(0);

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
    if (board[row][col]) return;

    const matchResult = checkMatch(board, row, col);
    
    if (matchResult.matched) {
      const newBoard = [...board];
      // Remove all matching tiles
      matchResult.positions!.forEach(([r, c]) => {
        newBoard[r][c] = null;
      });
      setBoard(newBoard);
      setScore(score + matchResult.score!);
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-gray-200">
      <div className=" flex flex-col items-center justify-center">
      <Score score={score} />
      <GameBoard board={board} onTileClick={handleTileClick} />
    </div>
      <ParticleEffectButton
        // className="relative z-20 mt-4"
        hidden={hidden}
        duration={500}
        color="#ff0000"
        type="triangle"
        direction="right"
        particlesAmountCoefficient={7}
        oscillationCoefficient={20}
        size={() => Math.random() * 2 + 1} // Smaller particles
        speed={() => rand(-2, 2)} // Adjusted speed
        // onComplete={() => setHidden(false)}
      >
       <div
          onClick={() => setHidden(true)}
          style={{
            padding: "1px",
            backgroundColor: "#ff0000",
            color: "white",
            border: "none",
            borderRadius: "50%",
            height: "20px",
            width: "20px",
            cursor: "pointer",
            position: 'relative'
          }}
        ></div>
      </ParticleEffectButton>
    </div>
  );
};