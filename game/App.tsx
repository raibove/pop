import { Page } from './shared';
import { PokemonPage } from './pages/PokemonPage';
import { HomePage } from './pages/HomePage';
import { usePage, useSetPage } from './hooks/usePage';
import { useEffect, useState } from 'react';
import { sendToDevvit } from './utils';
import { useDevvitListener } from './hooks/useDevvitListener';
import { Board } from './types';

const getPage = (page: Page, { postId, board }: { postId: string, board: Board }) => {
  switch (page) {
    case 'home':
      return <HomePage postId={postId} initialBoard={board} />;
    case 'loading':
      return <PokemonPage />;
    default:
      throw new Error(`Unknown page: ${page satisfies never}`);
  }
};

export const App = () => {
  const [postId, setPostId] = useState('');
  const [board,setBoard] = useState<Board>([]);
  const page = usePage();
  const setPage = useSetPage();
  const initData = useDevvitListener('INIT_RESPONSE');
  useEffect(() => {
    sendToDevvit({ type: 'INIT' });
  }, []);

  useEffect(() => {
    if (initData) {
      console.log('<< initData', initData);
      const brd = JSON.parse(initData.board);
      console.log('<< brd', brd);
      setBoard(brd);
      setPostId(initData.postId);
      setPage('home')
    }
  }, [initData, setPostId]);

  return <div className="h-screen overflow-hidden ">{getPage(page, { postId, board })}</div>;
};
