import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Sparkles } from 'lucide-react';

interface GameOverProps {
  score: number;
  onCheckLeadboard: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ score, onCheckLeadboard }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="bg-gray-800/90 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-purple-500/20"
      >
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="flex flex-col items-center"
        >
          <Sparkles className="text-yellow-400 w-16 h-16 mb-4" />
          <h2 className="text-3xl font-bold text-purple-300 mb-2">Game Over!</h2>
          <p className="text-gray-400 text-center mb-6">
            Great effort! Here's how you did:
          </p>
          
          <div className="gap-4 w-full mb-8">
            <div className="bg-purple-900/30 p-4 rounded-xl text-center">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-sm text-purple-300">Final Score</p>
              <p className="text-2xl font-bold text-purple-100">{score}</p>
            </div>
            {/* <div className="bg-purple-900/30 p-4 rounded-xl text-center">
              <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-sm text-purple-300">Level Reached</p>
              <p className="text-2xl font-bold text-purple-100">{level}</p>
            </div> */}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCheckLeadboard}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 transition-colors"
          >
            Check Leaderboard
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};