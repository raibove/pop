export const COLORS = [
    '#FF69B4', // pink
    '#4169E1', // blue
    '#32CD32', // green
    '#FFA500', // orange
    '#8A2BE2', // purple
    '#FF6347', // coral
    '#20B2AA', // turquoise
    '#DAA520', // goldenrod
    '#808080', // gray
    '#98FB98'  // palegreen
  ];
  
  export const getRandomColor = () => {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  };