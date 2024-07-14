import { Scene, GameObjects } from "phaser";

export class MainMenu extends Scene {
  logo: GameObjects.Image;
  title: GameObjects.Text;

  constructor() {
    super("MainMenu");
  }

  create() {
    this.title = this.add
      .text(512, 460, "Start Playing!", {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);

    this.scene.start("Game");
    // this.input.once("pointerdown", () => {
    //   this.scene.start("Game");
    // });
  }
}
