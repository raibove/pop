import { Page } from './shared';
import { PokemonPage } from './pages/PokemonPage';
import { HomePage } from './pages/HomePage';
import { usePage, useSetPage } from './hooks/usePage';
import { useEffect, useState } from 'react';
import { sendToDevvit } from './utils';
import { useDevvitListener } from './hooks/useDevvitListener';
import { Board } from './types';
import {createNewBoard} from '../src/utils/utils'
import { EASY_BOARD_SIZE, HARD_BOARD_SIZE } from '../src/constants';

const getPage = (page: Page, { postId, board, tileWidth }: { postId: string, board: Board, tileWidth: number }) => {
  switch (page) {
    case 'home':
      return <HomePage postId={postId} initialBoard={board} tileWidth={tileWidth}/>;
    case 'loading':
      return <PokemonPage />;
    default:
      throw new Error(`Unknown page: ${page satisfies never}`);
  }
};

export const App = () => {
  const [postId, setPostId] = useState('');
  const [board,setBoard] = useState<Board>([]);
  const [tileWidth, setTileWidth] = useState(40);

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
      setPage('home')
      if(initData.appWidth){
        console.log(initData.appWidth);
        setTileWidth(((initData.appWidth - 20)/brd.length) - 4);
      }
    }
  }, [initData, setPostId]);

  return <div className="h-screen overflow-hidden ">{getPage(page, { postId, board, tileWidth })}</div>;
};
