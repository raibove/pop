import { Devvit } from "@devvit/public-api";
import { Challenge } from "../core/challenge.js";


Devvit.addMenuItem({
  label: 'Create pop game',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    try {
      const { postUrl } = await Challenge.makeNewChallenge({ context });

      context.ui.navigateTo(postUrl);
    } catch (error) {
      console.error(`Error making new challenge:`, error);
    }
  },
});
