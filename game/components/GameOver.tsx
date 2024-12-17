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
      className="fixed flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="bg-slate-300 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-slate-500/20"
      >
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="flex flex-col items-center"
        >
          <Sparkles className="text-slate-600 w-16 h-16 mb-4" />
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Game Over!</h2>
          <p className="text-slate-600 text-center mb-6">
            Great effort! Here's how you did:
          </p>
          
          <div className="gap-4 w-full mb-8">
            <div className="bg-slate-500/30 p-4 rounded-xl text-center">
              <Trophy className="w-8 h-8 text-slate-700 mx-auto mb-2" />
              <p className="text-sm text-slate-700">Final Score</p>
              <p className="text-2xl font-bold text-slate-900">{score}</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCheckLeadboard}
            className="bg-slate-600 hover:bg-slate-700 text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 transition-colors"
          >
            Check Leaderboard
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};