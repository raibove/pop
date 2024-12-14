import { Board } from '../types';
import { rand } from '../utils';
import ParticleEffectButton from './ParticleEffect';

const GameBoard = ({ board, onTileClick, hiddenTiles, tileWidth }: {
  board: Board,
  onTileClick: (row: number, col: number) => void,
  hiddenTiles: Set<string>,
  tileWidth: number,
}) => {

  const tileColor = 'rgb(229, 231, 235)';
  return (
    <div id="board" className="inline-block bg-gray-100 p-4 rounded-lg">
      {board.map((row: (string | null)[], rowIndex: number) => (
        <div key={rowIndex} className="flex">
          {row.map((color: string | null, colIndex: number) => (
             <ParticleEffectButton
             key={`${rowIndex}-${colIndex}`}
             hidden={hiddenTiles.has(`${rowIndex}-${colIndex}`)}
             duration={500}
             color={color || tileColor}
             type="triangle"
             direction="right"
             particlesAmountCoefficient={7}
             oscillationCoefficient={20}
             size={() => Math.random() * 2 + 1}
             speed={() => rand(-2, 2)}
             onBtnClick={() => onTileClick(rowIndex, colIndex)}
             boxWidth={tileWidth}
           >
             <div
               style={{
                 backgroundColor: color || tileColor,
                 width: tileWidth,
                 height: tileWidth,
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
