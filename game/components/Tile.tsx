import React from 'react';

const Tile = ({ color, onClick, isClickable }) => {
  const baseClasses = "w-8 h-8 m-0.5 transition-all duration-200";
  const clickableClasses = isClickable ? "cursor-pointer hover:opacity-75" : "";
  
  return (
    <div
      className={`${baseClasses} ${clickableClasses}`}
      style={{ backgroundColor: color || 'transparent' }}
      onClick={onClick}
    />
  );
};

export default Tile;