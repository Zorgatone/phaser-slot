import { winTable } from "../config/payouts";
import { Symbols } from "../enums/symbols";
import { WinResult } from "../types/winResult";

const transpose = <T>(array: T[][]): T[][] => {
  const maxI = array.length;
  const maxJ = array[0].length;

  const rows = Array.from({ length: maxJ }, () => Array(maxI).fill(null));

  for (let i = 0; i < maxI; i++) {
    for (let j = 0; j < maxJ; j++) {
      rows[j][i] = array[i][j];
    }
  }

  return rows;
};

export const getWinnings = (
  reelsData: Symbols[][],
  betAmount: number,
): WinResult => {
  let winnings = 0;
  let highlights: WinResult["highlights"] = [];

  const rows = transpose(reelsData);

  // Check rows
  for (let startRow = 0; startRow < reelsData[0].length; startRow++) {
    const leftSymbol = reelsData[0][startRow];

    const row = rows[startRow];
    let symbolCount = 1;
    const tmpHighlight: WinResult["highlights"] = [[startRow, 0]];

    for (let col = 1; col < row.length; col++) {
      if (row[col] === leftSymbol) {
        tmpHighlight.push([startRow, col]);
        symbolCount++;
      } else {
        break;
      }
    }

    if (symbolCount >= 3) {
      winnings += betAmount * winTable[leftSymbol];
      highlights = highlights.concat(tmpHighlight);
    }
  }

  // Check diagonals
  const firstDiagonal = [
    [0, 0],
    [1, 1],
    [2, 2],
  ];
  const secondDiagonal = [
    [2, 0],
    [1, 1],
    [0, 2],
  ];

  [firstDiagonal, secondDiagonal].forEach((diagonal) => {
    const [[x, y], ...rest] = diagonal;
    const leftSymbol = rows[x][y];

    if (rest.every(([i, j]) => rows[i][j] === leftSymbol)) {
      highlights = highlights.concat(
        diagonal.map(([x, y]) => [x, y] as [number, number]),
      );
      winnings += betAmount * winTable[leftSymbol];
    }
  });

  return {
    winnings,
    highlights,
  };
};
