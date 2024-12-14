import './triggers/install.js';
import './triggers/upgrade.js';
import './core/menu-action.js';

import { Devvit, useState } from '@devvit/public-api';
import { sendMessageToWebview } from './utils/utils.js';
import { WebviewToBlockMessage } from '../game/shared.js';
import { WEBVIEW_ID } from './constants.js';
import { Preview } from './components/Preview.js';
import { ChallengeToPost } from './core/challengeToPost.js';
import { Challenge } from './core/challenge.js';

Devvit.configure({
  redditAPI: true,
  http: true,
  redis: true,
  realtime: true,
});

// Add a post type definition
Devvit.addCustomPostType({
  name: 'Pop Game Post',
  height: 'tall',
  render: (context) => {
    const [initialState] = useState<{
      user: {
        username: string | null;
        avatar: string | null;
      } | null;
      challenge: number;
    }>(async () => {
      const [user, challenge] = await Promise.all([
        context.reddit.getCurrentUser(),
        ChallengeToPost.getChallengeNumberForPost({
          context: context,
          postId: context.postId!,
        }),
      ]);

      if (!user) {
        return {
          user: null,
          challenge,
        };
      }

      const avatar = await context.reddit.getSnoovatarUrl(user.username);

      return { user: { username: user.username, avatar: avatar ?? null }, challenge };
    });

    if (!initialState.user?.username) {
      return <Preview text="Please login to play." />;
    }
    // if challenge is undefined make a new challenge??
    
    const [launched, setLaunched] = useState(false);

    return (
      <vstack height="100%" width="100%" alignment="center middle">
        {launched ? (
          <webview
            id={WEBVIEW_ID}
            url="index.html"
            width={'100%'}
            height={'100%'}
            onMessage={async (event) => {
              console.log('Received message', event);
              const data = event as unknown as WebviewToBlockMessage;
              switch (data.type) {
                case 'INIT':
                  const challenge = await Challenge.getChallenge({
                    redis: context.redis,
                    challenge: initialState.challenge,
                  });
                  
                  sendMessageToWebview(context, {
                    type: 'INIT_RESPONSE',
                    payload: {
                      postId: context.postId!,
                      board: challenge.board,
                      username: initialState.user!.username!,
                      avatar: initialState.user!.avatar??'',
                      appWidth:Math.min((context.dimensions?.height ?? 300) - 50, context.dimensions?.width ?? 300),
                    },
                  });
                  break;
                default:
                  console.error('Unknown message type', data satisfies never);
                  break;
              }
            }}
          />
        ) : (
          <button
            onPress={() => {
              setLaunched(true);
            }}
          >
            Launch
          </button>
        )}
      </vstack>
    );
  },
});

export default Devvit;
