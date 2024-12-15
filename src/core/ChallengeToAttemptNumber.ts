import { RedisType } from "./challenge.js";

export * as ChallengeToAttemptNumber from "./ChallengeToAttemptNumber.js";

export const getChallengeLatestAttemptNumbeMetaKey = (challenge:number, username: string)=>{
return `challenge:${challenge}:meta:${username}:latestAttempt`;
}
// Save or update the user's latest attempt number
export const updateLatestAttemptNumber = async (redis: RedisType, challenge: number, username: string, attemptNumber: number) => {
    const metaKey =  getChallengeLatestAttemptNumbeMetaKey(challenge, username);

    // Update the latest attempt number for the user
    await redis.hSet(metaKey, {attemptNumber: attemptNumber.toString(10)});
    return attemptNumber;
};

// Get the user's latest attempt number
export const getLatestAttemptNumber = async (redis: RedisType, challenge: number, username: string): Promise<number | null> => {
    const metaKey = getChallengeLatestAttemptNumbeMetaKey(challenge, username);

    // Retrieve the latest attempt number for the user
    const attemptNumber = await redis.hGet(metaKey, 'attemptNumber');
    return attemptNumber ? parseInt(attemptNumber, 10) : null; // Return null if no data exists
};
