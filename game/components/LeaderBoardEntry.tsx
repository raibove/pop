import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award } from 'lucide-react';

// LeaderboardEntry Component
const RankIcon = ({ rank }: { rank: number }) => {
  switch (rank) {
    case 1:
      return <Trophy className="w-5 h-5 text-yellow-600" />;
    case 2:
      return <Medal className="w-5 h-5 text-gray-500" />;
    case 3:
      return <Award className="w-5 h-5 text-amber-700" />;
    default:
      return null;
  }
};

export const LeaderboardEntry = ({ player, index }: {
    player: { username: string; score: number };
    index: number;
}) => {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      className={`flex items-center gap-4 p-3 rounded-lg ${
        index <= 2 ? 'bg-gray-300/50' : 'hover:bg-gray-300/30'
      } transition-colors`}
    >
      <div className="w-8 flex justify-center">
        <RankIcon rank={index + 1} />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-gray-800">{player.username}</p>
        <p className="text-sm text-gray-600">{player.score} points</p>
      </div>
      <div className="text-right">
        {/* Placeholder for potential future features */}
      </div>
    </motion.div>
  );
};