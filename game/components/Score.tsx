import React from 'react';

const Score = ({ score }: {score: number}) => {
  return (
    <div className="text-3xl font-bold mb-4">
      SCORE: {score}
    </div>
  );
};

export default Score;