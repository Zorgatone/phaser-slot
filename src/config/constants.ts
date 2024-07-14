export const symbolImageSize = {
  width: 200,
  height: 200,
};

export const symbolGameSize = {
  width: 150,
  height: 150,
};

export const reelRows = 3;
export const reelsCount = 5;

export const gridGap = 10;

export const reelSize = {
  width: symbolGameSize.width,
  height: (symbolGameSize.height + gridGap) * reelRows - gridGap,
};

export const boardSize = {
  width: (reelSize.width + gridGap) * reelsCount + gridGap,
  height: reelSize.height + 2 * gridGap,
};

// export const margin = 50;

// export const gameSize = {
//   width: margin * 2 + boardSize.width,
//   height: margin * 2 + boardSize.height,
// };
