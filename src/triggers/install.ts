import { Devvit, TriggerContext } from "@devvit/public-api";
import { Challenge } from "../core/challenge.js";

export const initialize = async (context: TriggerContext) => {
    await Challenge.initialize({
      redis: context.redis,
    });
  };
  
  Devvit.addTrigger({
    events: ["AppInstall"],
    onEvent: async (_, context) => {
      await initialize(context);
    },
  });
  