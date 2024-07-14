import { reelRows } from "../config/constants";
import { Symbols } from "../enums/symbols";

const shuffle = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
};

export const getRandomReel = () => {
  const allSymbols = Object.values(Symbols);

  // Shuffle and take last N elements
  return shuffle(allSymbols).slice(allSymbols.length - reelRows);
};
