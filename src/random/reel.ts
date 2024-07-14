import { reelRows } from "../config/constants";
import { Symbols } from "../enums/symbols";

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomReel = () => {
  const allSymbols = Object.values(Symbols);

  return new Array<Symbols>(reelRows).fill(null!).map(() => {
    const rand = getRandomInt(0, allSymbols.length - 1);
    const symbol = allSymbols[rand];

    allSymbols.splice(rand, 1); // remove it to avoid duplicate in same reel

    return symbol;
  });
};
