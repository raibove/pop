import { Page } from './shared';
import { HomePage } from './pages/HomePage';
import { usePage, useSetPage } from './hooks/usePage';
import { useEffect, useState } from 'react';
import { sendToDevvit } from './utils';
import { useDevvitListener } from './hooks/useDevvitListener';
import { Board } from './types';
import LeaderboardPage from './pages/LeaderboardPage';
import UserChoicePage from './pages/UserChoicePage';

const getPage = (page: Page, { postId, board, tileWidth, initialHiddenTiles, initialScore, attemptNumber, isGameOver, setIsGameOver }:
  { postId: string, board: Board, tileWidth: number, initialHiddenTiles: string, initialScore: number, attemptNumber: number | null, isGameOver: boolean, setIsGameOver: (gameOv: boolean)=>void }) => {
  switch (page) {
    case 'home':
      return <HomePage postId={postId}
        initialBoard={board}
        tileWidth={tileWidth}
        initialHiddenTiles={initialHiddenTiles}
        initialScore={initialScore}
        attemptNumber={attemptNumber}
        setIsGameOver={setIsGameOver}
      />;
    case 'loading':
      return <div />;
    case 'userChoice':
      return <UserChoicePage attemptNumber={attemptNumber!}/>;
    // case 'gameOver':
    //   return <></>
    case 'leaderboard':
      return <LeaderboardPage isGameOver={isGameOver}/>
    default:
      throw new Error(`Unknown page: ${page satisfies never}`);
  }
};

export const App = () => {
  const [postId, setPostId] = useState('');
  const [board, setBoard] = useState<Board>([]);
  const [tileWidth, setTileWidth] = useState(40);
  const [initialHiddenTiles, setInitialHiddenTiles] = useState('');
  const [initialScore, setInitialScore] = useState(0);
  const [attemptNumber, setAttemptNumber] = useState<null | number>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const page = usePage();
  const setPage = useSetPage();
  const initData = useDevvitListener('INIT_RESPONSE');
  useEffect(() => {
    // setBoard(createNewBoard(HARD_BOARD_SIZE));
    sendToDevvit({ type: 'INIT' });
  }, []);

  useEffect(() => {
    if (initData) {
      const brd = JSON.parse(initData.board);
      setBoard(brd);
      setPostId(initData.postId);
      setAttemptNumber(initData.attemptNumber);

      if (initData.isGameOver) {
        setPage('userChoice')
        setIsGameOver(true);
        return;
      }
      setIsGameOver(false)
      setInitialHiddenTiles(initData.hiddenTiles);
      setInitialScore(initData.score);
      if (initData.appWidth) {
        setTileWidth(((initData.appWidth - 20) / brd.length) - 4);
      }
      setPage('home')
    }
  }, [initData, setPostId]);

  return <div className="h-screen overflow-hidden ">{getPage(page, { postId, board, tileWidth, initialHiddenTiles, initialScore, attemptNumber, isGameOver, setIsGameOver })}</div>;
};
