import { Page } from './shared';
import { HomePage } from './pages/HomePage';
import { usePage, useSetPage } from './hooks/usePage';
import { useEffect, useState } from 'react';
import { sendToDevvit } from './utils';
import { useDevvitListener } from './hooks/useDevvitListener';
import { Board } from './types';
import LeaderboardPage from './pages/LeaderboardPage';
import UserChoicePage from './pages/UserChoicePage';

const getPage = (page: Page, { postId, board, tileWidth, initialHiddenTiles, initialScore }: { postId: string, board: Board, tileWidth: number, initialHiddenTiles: string, initialScore: number }) => {
  switch (page) {
    case 'home':
      return <HomePage postId={postId} initialBoard={board} tileWidth={tileWidth} initialHiddenTiles={initialHiddenTiles} initialScore={initialScore}/>;
    case 'loading':
      return <div />;
    case 'userChoice':
      return <UserChoicePage />;
    // case 'gameOver':
    //   return <></>
    case 'leaderboard':
    return <LeaderboardPage />
    default:
      throw new Error(`Unknown page: ${page satisfies never}`);
  }
};

export const App = () => {
  const [postId, setPostId] = useState('');
  const [board,setBoard] = useState<Board>([]);
  const [tileWidth, setTileWidth] = useState(40);
  const [initialHiddenTiles, setInitialHiddenTiles] = useState('');
  const [initialScore, setInitialScore] = useState(0);

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
      if(initData.isGameOver){
        setPage('userChoice')
        return;
      } 
      setPage('home')
      setInitialHiddenTiles(initData.hiddenTiles);
      setInitialScore(initData.score);
      if(initData.appWidth){
        console.log(initData.appWidth);
        setTileWidth(((initData.appWidth - 20)/brd.length) - 4);
      }
    }
  }, [initData, setPostId]);

  return <div className="h-screen overflow-hidden ">{getPage(page, { postId, board, tileWidth, initialHiddenTiles, initialScore })}</div>;
};
