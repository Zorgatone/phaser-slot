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
import { getWinnings } from "../utils/getWinnings";
import { symbolMap } from "../config/symbolMap";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  msg_text: Phaser.GameObjects.Text;

  reelsData: Symbols[][];
  reels: Phaser.GameObjects.Container[];
  mask: Phaser.Display.Masks.GeometryMask;
  balance: number;
  winnings: number;
  betAmount: number;
  spin: boolean;
  balanceText: Phaser.GameObjects.Text;
  isSpinning: boolean;
  winRectangle: Phaser.GameObjects.Rectangle;
  winText: Phaser.GameObjects.Text;

  constructor() {
    super("Game");

    this.balance = 123456789;
    this.betAmount = 15;
    this.winnings = 0;
    this.spin = false;
    this.isSpinning = false;
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
        // Drops the symbols
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
      x: centerX - 100,
      y: centerY + boardSize.height / 2 + 30,
      width: 200,
      height: 60,
    };

    if (this.balance >= this.betAmount) {
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
        if (!this.isSpinning) {
          this.spin = true;
          this.balance -= this.betAmount;
          this.isSpinning = true;
          if (this.winRectangle) {
            this.winRectangle.destroy();
          }
          if (this.winText) {
            this.winText.destroy();
          }
          this.scene.start("Game"); // Restart to spin
        }
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
    }

    this.balanceText = this.add.text(
      centerX,
      centerY - boardSize.height / 2 - 60,
      `Balance: ${this.balance} USD`,
      {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      },
    );
    this.balanceText.setOrigin(0.5);

    const betAmount = this.add.text(
      centerX - boardSize.width / 2 - 60,
      centerY + boardSize.height / 2 + 60,
      `Bet amount: ${this.betAmount} USD`,
      {
        fontFamily: "Arial Black",
        fontSize: 24,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      },
    );
    betAmount.setOrigin(0, 0.5);

    const winnings = this.add.text(
      centerX + boardSize.width / 2 + 60,
      centerY + boardSize.height / 2 + 60,
      `Winnings: ${this.winnings} USD`,
      {
        fontFamily: "Arial Black",
        fontSize: 24,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      },
    );
    winnings.setOrigin(1, 0.5);

    this.makeReels(this.spin);

    if (this.spin) {
      this.time.delayedCall(300 + 150 * (reelsCount - 1), () => {
        this.isSpinning = false;
        const { winnings: winningsAmount, highlights } = getWinnings(
          this.reelsData,
          this.betAmount,
        );

        if (winningsAmount > 0) {
          this.balance += this.betAmount + winningsAmount;
          this.balanceText.setText(`Balance: ${this.balance} USD`);
          this.winnings += winningsAmount;
          winnings.setText(`Winnings: ${this.winnings} USD`);
        }

        for (const [row, col] of highlights) {
          const sprite = this.reels[col].getAt(
            row,
          ) as Phaser.GameObjects.Sprite;

          sprite.setTexture(symbolMap[sprite.texture.key as Symbols]);
        }

        const winningsBox = {
          width: 600,
          height: 90,
          x: centerX,
          y: centerY,
        };

        if (winningsAmount > 0) {
          this.winRectangle = this.add.rectangle(
            winningsBox.x,
            winningsBox.y,
            winningsBox.width,
            winningsBox.height,
            0xffff00,
            0.5,
          );

          this.winText = this.add.text(
            winningsBox.x,
            winningsBox.y,
            `You won ${winningsAmount} USD!`,
            {
              fontFamily: "Arial Black",
              fontSize: 48,
              color: "#ffffff",
              stroke: "#000000",
              strokeThickness: 8,
              align: "center",
            },
          );
          this.winText.setOrigin(0.5);

          this.time.delayedCall(2000, () => {
            this.winText.destroy();
            this.winRectangle.destroy();
          });
        }
      });
    }
  }
}
