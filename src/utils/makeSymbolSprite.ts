import { symbolGameSize, symbolImageSize } from "../config/constants";
import { Symbols } from "../enums/symbols";

export const makeSymbolSprite =
  (factory: Phaser.GameObjects.GameObjectFactory) =>
  (x: number, y: number, key: Symbols): Phaser.GameObjects.Sprite => {
    const sprite = factory.sprite(x, y, key);

    const scaleX = symbolGameSize.width / symbolImageSize.width;
    const scaleY = symbolGameSize.height / symbolImageSize.height;

    sprite.setScale(scaleX, scaleY);

    return sprite;
  };
