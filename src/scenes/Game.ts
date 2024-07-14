import { Scene } from "phaser";

import {
  boardSize,
  gridGap,
  reelsCount,
  reelSize,
  symbolGameSize,
} from "../config/constants";
import { getRandomReel } from "../random/reel";
import { makeSymbolSprite } from "../utils/makeSymbolSprite";
import { Symbols } from "../enums/symbols";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  msg_text: Phaser.GameObjects.Text;

  reelsData: Symbols[][];
  reels: Phaser.GameObjects.Container[];

  constructor() {
    super("Game");
  }

  init() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    this.add.rectangle(
      centerX,
      centerY,
      boardSize.width,
      boardSize.height,
      0x666666,
    );

    const maskShape = this.add.graphics();
    maskShape.fillRect(
      centerX - boardSize.width / 2,
      centerY - boardSize.height / 2,
      boardSize.width,
      boardSize.height,
    );

    const mask = maskShape.createGeometryMask();

    this.reelsData = new Array(reelsCount)
      .fill(null)
      .map(() => getRandomReel());

    const makeSprite = makeSymbolSprite(this.add);

    this.reels = this.reelsData.map((data, i) => {
      const reelX =
        centerX -
        boardSize.width / 2 +
        gridGap +
        reelSize.width / 2 +
        i * (reelSize.width + gridGap);
      // const reelY = boardSize.height -reelSize.height;
      const reelY = centerY - boardSize.height / 2 + gridGap;

      const reel = this.add.container(
        reelX,
        reelY,
        data.map((symbol, i) =>
          makeSprite(
            0,
            symbolGameSize.height / 2 + i * (symbolGameSize.height + gridGap),
            symbol,
          ),
        ),
      );

      reel.setMask(mask);

      return reel;
    });
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x333333);

    // this.msg_text = this.add.text(512, 384, "Game", {
    //   fontFamily: "Arial Black",
    //   fontSize: 38,
    //   color: "#ffffff",
    //   stroke: "#000000",
    //   strokeThickness: 8,
    //   align: "center",
    // });
    // this.msg_text.setOrigin(0.5);

    // this.input.once("pointerdown", () => {
    //   this.scene.start("GameOver");
    // });
  }
}
