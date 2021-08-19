import { repeat } from '../utils';

const quantityOfCards = 52;
const width = 90.5;
const height = 131.5;

export function createSprites(): void {
    PIXI.Texture.addToCache(PIXI.Texture.from('resources/number-1.png'), 'number-1');
    PIXI.Texture.addToCache(PIXI.Texture.from('resources/number-2.png'), 'number-2');
    PIXI.Texture.addToCache(PIXI.Texture.from('resources/number-3.png'), 'number-3');
    PIXI.Texture.addToCache(PIXI.Texture.from('resources/start-button.png'), 'start-button');
    PIXI.Texture.addToCache(PIXI.Texture.from('resources/home-button.png'), 'home-button');

    addIconTexture();

    const cardsTexture = PIXI.Texture.from('resources/playing-cards.png');

    let rowIndex = 0;
    let colIndex = 0;
    repeat(quantityOfCards).map(currentValue => {
        rowIndex++;
        if (currentValue % 13 === 0) {
            rowIndex = 0;
            colIndex = Math.floor(currentValue / 13);
        }
        const texture = new PIXI.Texture(
            cardsTexture.baseTexture,
            new PIXI.Rectangle(width * rowIndex, height * colIndex, width, height),
            cardsTexture.orig,
            cardsTexture.trim
        );
        PIXI.Texture.addToCache(texture, 'card-' + currentValue);
    });
}

function addIconTexture() {
    repeat(6).map(value => {
        PIXI.Texture.addToCache(PIXI.Texture.from(`resources/icon-${value}.png`), 'icon-' + value);
    });
}

export function fromCacheAsTexture(textureName: string): PIXI.Texture {
    return PIXI.utils.TextureCache[textureName];
}

export function fromCacheAsSprite(textureName: string): PIXI.Sprite {
    return new PIXI.Sprite(fromCacheAsTexture(textureName));
}
