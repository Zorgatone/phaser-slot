import { Scene, Geom } from "phaser";

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
  mask: Phaser.Display.Masks.GeometryMask;
  balance: number;
  spin: boolean;

  constructor() {
    super("Game");

    this.balance = 123456789;
    this.spin = false;
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

    this.mask = maskShape.createGeometryMask();

    this.randomizeSymbols();
  }

  randomizeSymbols() {
    this.reelsData = new Array(reelsCount)
      .fill(null)
      .map(() => getRandomReel());
  }

  makeReels(spin = false) {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    const makeSprite = makeSymbolSprite(this.add);

    this.reels = this.reelsData.map((data, i) => {
      const reelX =
        centerX -
        boardSize.width / 2 +
        gridGap +
        reelSize.width / 2 +
        i * (reelSize.width + gridGap);
      const finalY = centerY - boardSize.height / 2 + gridGap;
      const initialY =
        centerY - boardSize.height / 2 - reelSize.height - gridGap;

      const reel = this.add.container(
        reelX,
        spin ? initialY : finalY,
        data.map((symbol, i) =>
          makeSprite(
            0,
            symbolGameSize.height / 2 + i * (symbolGameSize.height + gridGap),
            symbol,
          ),
        ),
      );

      reel.setMask(this.mask);

      if (spin) {
        this.tweens.add({
          targets: reel,
          y: finalY,
          duration: 300,
          ease: "linear",
          delay: i * 150,
        });
      }

      return reel;
    });
  }

  create() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x333333);

    const button = {
      x: centerX - 200,
      y: centerY + boardSize.height / 2 + 30,
      width: 400,
      height: 60,
    };

    const graphics = this.add.graphics();
    graphics.fillStyle(0x339933, 1);
    graphics.fillRoundedRect(
      button.x,
      button.y,
      button.width,
      button.height,
      20,
    );

    graphics.setInteractive(
      new Geom.Rectangle(button.x, button.y, button.width, button.height),
      Geom.Rectangle.Contains,
    );

    graphics.on("pointerdown", () => {
      this.spin = true;
      this.scene.start("Game"); // Restart to spin
    });

    this.msg_text = this.add.text(
      button.x + button.width / 2,
      button.y + button.height / 2,
      "Spin",
      {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      },
    );
    this.msg_text.setOrigin(0.5);

    this.makeReels(this.spin);

    // if (this.spin) {
    //   this.time.delayedCall(300 + 150 * (reelsCount - 1), () => {
    //     const text = this.add.text(centerX, centerY, "Spin Finished!", {
    //       fontFamily: "Arial Black",
    //       fontSize: 38,
    //       color: "#ffffff",
    //       stroke: "#000000",
    //       strokeThickness: 8,
    //       align: "center",
    //     });
    //     text.setOrigin(0.5);
    //   });
    // }
  }
}
