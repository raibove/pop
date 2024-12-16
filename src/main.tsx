import './triggers/install.js';
import './triggers/upgrade.js';
import './core/menu-action.js';

import { Devvit, useState } from '@devvit/public-api';
import { isServerCall, sendMessageToWebview } from './utils/utils.js';
import { WebviewToBlockMessage } from '../game/shared.js';
import { WEBVIEW_ID } from './constants.js';
import { Preview } from './components/Preview.js';
import { ChallengeToPost } from './core/challengeToPost.js';
import { Challenge } from './core/challenge.js';
import { ChallengeLeaderboard } from './core/leaderboard.js';
import { ChallengeToAttemptNumber } from './core/ChallengeToAttemptNumber.js';

const GAME_BOARD_HEADER_HEIGHT = 80;
Devvit.configure({
  redditAPI: true,
  http: true,
  redis: true,
  realtime: true,
});

interface PostInfo {
  user: {
    username: string | null;
    avatar: string | null;
  } | null;
  challenge?: number;
  // attemptNumber: number | null;
}

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
      challenge?: number;
      // attemptNumber: number | null;
    }>(async (): Promise<PostInfo> => {
      const [user, challenge] = await Promise.all([
        context.reddit.getCurrentUser(),
        ChallengeToPost.getChallengeNumberForPost({
          context: context,
          postId: context.postId!,
        }),
      ]);
      let attemptNumber: number | null = null;

      if (!user) {
        return {
          user: null,
          challenge,
          // attemptNumber
        };
      }

      // if (challenge) {
      //   attemptNumber = await ChallengeToAttemptNumber.getLatestAttemptNumber(
      //     context.redis,
      //     challenge,
      //     user.username,
      //   );
      //   if (!attemptNumber) {
      //     attemptNumber = await ChallengeToAttemptNumber.updateLatestAttemptNumber(
      //       context.redis,
      //       challenge,
      //       user.username,
      //       1
      //     );
      //   }
      // }
      return { user: { username: user.username, avatar: null }, challenge };
    });

    if (!initialState.user?.username) {
      return <Preview text="Please login to play." />;
    }

    if (!initialState.challenge) {
      return <Preview text="Challenge not found. Please create new post." />;
    }

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
              const data = event as unknown as WebviewToBlockMessage;
              switch (data.type) {
                case 'INIT':
                  const challenge = await Challenge.getChallenge({
                    redis: context.redis,
                    challenge: initialState.challenge,
                  });

                  let attemptNumber: number | null = null;
                  if (challenge) {
                    attemptNumber = await ChallengeToAttemptNumber.getLatestAttemptNumber(
                      context.redis,
                      initialState.challenge!,
                      initialState.user!.username!,
                    );
                    if (!attemptNumber) {
                      attemptNumber = await ChallengeToAttemptNumber.updateLatestAttemptNumber(
                        context.redis,
                        initialState.challenge!,
                        initialState.user!.username!,
                        1
                      );
                    }
                  }
                  console.log('<< attemptnumber', attemptNumber)
                  const gameState = await ChallengeLeaderboard.getGameState({
                    redis: context.redis,
                    challenge: initialState.challenge!,
                    username: initialState.user!.username!,
                    attemptNumber: attemptNumber!,
                  });

                  sendMessageToWebview(context, {
                    type: 'INIT_RESPONSE',
                    payload: {
                      postId: context.postId!,
                      board: challenge.board,
                      username: initialState.user!.username!,
                      avatar: initialState.user!.avatar ?? '',
                      appWidth: Math.min((context.dimensions?.height ?? 300) - GAME_BOARD_HEADER_HEIGHT, context.dimensions?.width ?? 300),
                      hiddenTiles: gameState && gameState.initialHiddenTiles ? gameState.initialHiddenTiles : '',
                      score: gameState && gameState.score ? gameState.score : 0,
                      isGameOver: gameState && gameState.isGameOver ? gameState.isGameOver : false,
                      attemptNumber: attemptNumber!
                    },
                  });
                  break;
                case 'UPDATE_SCORE':
                  try {
                    await ChallengeLeaderboard.addEntry({
                      redis: context['redis'],
                      challenge: initialState.challenge!,
                      score: data.payload.score,
                      username: initialState.user!.username!,
                      attemptNumber: data.payload.attemptNumber,
                      hiddenTiles: data.payload.hiddenTiles,
                      isGameOver: data.payload.isGameOver
                    })
                  } catch (error) {
                    isServerCall(error);

                    console.error('Error submitting guess:', error);
                    // Sometimes the error is nasty and we don't want to show it
                    if (error instanceof Error && !['Error: 2'].includes(error.message)) {
                      context.ui.showToast(error.message);
                      return;
                    }
                    context.ui.showToast(`I'm not sure what happened. Please try again.`);
                  }
                  break;
                case 'CREATE_NEW_GAME':
                  try {
                    const { postUrl } = await Challenge.makeNewChallenge({ context });

                    context.ui.navigateTo(postUrl);
                  } catch (error) {
                    isServerCall(error);

                    console.error('Error creating post:', error);
                    // Sometimes the error is nasty and we don't want to show it
                    if (error instanceof Error && !['Error: 2'].includes(error.message)) {
                      context.ui.showToast(error.message);
                      return;
                    }
                    context.ui.showToast(`I'm not sure what happened. Please try again.`);
                  }
                  break;
                case 'PLAY_AGAIN':
                  // make new attempt number
                  console.log('<< play again')
                  const newAttemptNumber = await ChallengeToAttemptNumber.updateLatestAttemptNumber(
                    context.redis,
                    initialState.challenge!,
                    initialState.user!.username!,
                    data.payload.attemptNumber! + 1
                  );
                  console.log('newAttemptNumber', newAttemptNumber)
                  sendMessageToWebview(
                    context,
                    {
                      type: 'PLAY_AGAIN_CONFIGURED',
                      payload: { newAttemptNumber }
                    }
                  )
                  console.log('<< message sent')
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
