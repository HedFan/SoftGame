import { fromCacheAsTexture } from "./createSprites";

export const createButton = (textureName: string, width: number, height: number): PIXI.Sprite => {
    const buttonTexture = fromCacheAsTexture(textureName);
    const button = new PIXI.Sprite(buttonTexture);
    button.interactive = true;
    button.buttonMode = true;
    button.hitArea = new PIXI.Rectangle(0, 0, width, height);
    button.position.set(120, 10);
    return button
}
