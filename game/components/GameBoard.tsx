import { Board } from '../types';
import { rand } from '../utils';
import ParticleEffectButton from './ParticleEffect';
import Tile from './Tile';

const GameBoard = ({ board, onTileClick }: {
  board: Board,
  onTileClick: (row: number, col: number) => void
}) => {
  console.log(board);
  const hiddenTiles = new Set<string>();
  return (
    <div id="board" className="inline-block bg-gray-100 p-4 rounded-lg">
      {board.map((row: (string | null)[], rowIndex: number) => (
        <div key={rowIndex} className="flex">
          {row.map((color: string | null, colIndex: number) => (
             <ParticleEffectButton
             key={`${rowIndex}-${colIndex}`}
             hidden={hiddenTiles.has(`${rowIndex}-${colIndex}`)}
             duration={500}
             color={color || "#ff0000"}
             type="triangle"
             direction="right"
             particlesAmountCoefficient={7}
             oscillationCoefficient={20}
             size={() => Math.random() * 2 + 1}
             speed={() => rand(-2, 2)}
           >
             <div
               onClick={() => onTileClick(rowIndex, colIndex)}
               style={{
                 backgroundColor: color || 'transparent',
                 width: '40px',
                 height: '40px',
                 margin: '2px',
                 cursor: 'pointer',
                 borderRadius: '4px'
               }}
             />
           </ParticleEffectButton>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
