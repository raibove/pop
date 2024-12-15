import { RedisType } from "./challenge.js";
export * as ChallengeLeaderboard from "./leaderboard.js";

export const getChallengeLeaderboardScoreKey = (challenge: number) =>
    `challenge:${challenge}:leaderboard:score` as const;

export const getChallengeLeaderboardMetaKey = (challenge: number) =>
    `challenge:${challenge}:leaderboard:meta` as const;

export const addEntry = async ({ redis, challenge, username, score, attemptNumber, hiddenTiles, isGameOver }: {
    redis: RedisType,
    challenge: number,
    username: string,
    score: number,
    attemptNumber: number,
    hiddenTiles: string,
    isGameOver: boolean
}) => {
    const scoreKey = getChallengeLeaderboardScoreKey(challenge);
    const metaKey = getChallengeLeaderboardMetaKey(challenge);

    await redis.zAdd(scoreKey, {
        member: `${username}:${attemptNumber}`, 
        score,
    });

    const fieldValues = {
        [`${username}:${attemptNumber}`]: JSON.stringify({ score, attemptNumber, hiddenTiles, isGameOver })
    };
    await redis.hSet(metaKey, fieldValues);
};

export const getLeaderboardByScore = async ({ redis, challenge, sort, start, stop }: {
    redis: RedisType,
    challenge: number,
    sort: "ASC" | "DESC",
    start: number,
    stop: number
}) => {
    const result = await redis.zRange(
        getChallengeLeaderboardScoreKey(challenge),
        start,
        stop,
        { by: "rank", reverse: sort === "DESC" },
    );

    if (!result) {
        throw new Error(`No leaderboard found challenge ${challenge}`);
    }
    return result;
}

export const getGameState = async ({ redis, challenge, username, attemptNumber }: {
    redis: RedisType,
    challenge: number,
    username: string,
    attemptNumber: number
}) => {
    const metaKey = getChallengeLeaderboardMetaKey(challenge);
    const field = `${username}:${attemptNumber}`;
    const value = await redis.hGet(metaKey, field);
    if (!value) {
        // throw new Error(`No game state found for challenge ${challenge} user ${username} attempt ${attemptNumber}`);
        return null;
    }
    return JSON.parse(value);
}