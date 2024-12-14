import { Devvit, Post } from '@devvit/public-api';
import { createNewBoard, stringifyValues } from '../utils/utils.js';
import { Preview } from '../components/Preview.js';
import { ChallengeToPost } from './challengeToPost.js';
import { ChallengeInfo } from '../../game/shared.js';
import { HARD_BOARD_SIZE } from '../constants.js';

interface ChallengeConfig {
  redis: RedisType,
  challenge: number,
  config: ChallengeInfo
}

export type RedisType = Devvit.Context['redis']
export * as Challenge from './challenge.js';

export const getCurrentChallengeNumberKey = () => 'current_challenge_number' as const;

export const setCurrentChallengeNumber = async ({ number, redis }: { number: number; redis: RedisType }) => {
  await redis.set(getCurrentChallengeNumberKey(), number.toString());
};

export const initialize = async ({ redis }: { redis: RedisType }) => {
  const result = await redis.get(getCurrentChallengeNumberKey());
  if (!result) {
    await redis.set(getCurrentChallengeNumberKey(), '0');
  } else {
    console.log('Challenge key already initialized');
  }
}
export const getCurrentChallengeNumber = async ({ redis }: { redis: RedisType }) => {
  const result = await redis.get(getCurrentChallengeNumberKey());
  if (!result) {
    throw new Error('No current challenge number found');
  }
  return parseInt(result);
}

export const getChallengeKey = (challenge: number) => `challenge:${challenge}` as const;

export const getChallenge = async ({ redis, challenge }: { redis: RedisType, challenge: any }) => {
  const result = await redis.hGetAll(getChallengeKey(challenge));

  if (!result) {
    throw new Error('No challenge found');
  }
  return result;
}

export const setChallenge = async ({ redis, challenge, config }: ChallengeConfig) => {
  await redis.hSet(getChallengeKey(challenge), stringifyValues(config));
}

export const makeNewChallenge = async ({ context, postId }: { context: Devvit.Context, postId?: string }) => {
  console.log('Making new challenge...');
  const [currentChallengeNumber, currentSubreddit] = await Promise.all([
    getCurrentChallengeNumber({ redis: context.redis }),
    context.reddit.getCurrentSubreddit(),
  ]);

  const newBoard = createNewBoard(HARD_BOARD_SIZE);
  const newChallengeNumber = currentChallengeNumber + 1;

  let post: Post | undefined;

  try {
    // TODO: Transactions are broken
    const txn = context.redis;
    // const txn = await context.redis.watch();
    // await txn.multi();

    // Clean up the word list while we have the data to do so
    // await WordList.setCurrentWordListWords({
    //   redis: txn,
    //   // Remove all words up to and including the found word
    //   words: wordList.slice(unusedWordIndex + 1),
    // });

    if (!postId) {
      post = await context.reddit.submitPost({
        subredditName: currentSubreddit.name,
        title: `Pop #${newChallengeNumber}`,
        preview: <Preview />,
      });
    } else {
      post = await context.reddit.getPostById(postId);
    }

    await setChallenge({
      redis: txn,
      challenge: newChallengeNumber,
      config: {
        board: JSON.stringify(newBoard),
        totalPlayers: 0,
      },
    });

    await setCurrentChallengeNumber({ number: newChallengeNumber, redis: txn });
    await ChallengeToPost.setChallengeNumberForPost({
      challenge: newChallengeNumber,
      postId: post.id,
      redis: txn,
    });

    console.log(
      'New challenge created:',
      'New Challenge Number:',
      newChallengeNumber,
      'New board:',
      newBoard,
      'Post ID:',
      post.id
    );

    return {
      postId: post.id,
      postUrl: post.url,
      challenge: newChallengeNumber,
    };
  } catch (error) {
    console.error('Error making new challenge:', error);

    // If the transaction fails, remove the post if created
    if (post) {
      console.log(`Removing post ${post.id} due to new challenge error`);
      await context.reddit.remove(post.id, false);
    }

    throw error;
  }
}
