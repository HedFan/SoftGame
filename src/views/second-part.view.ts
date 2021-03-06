import { GarbageBag, GarbageCollect } from '../components';
import { repeat, fromCacheAsSprite, getRandom } from '../utils';

export const defaultGlyphs = [
  'Congrats!',
  'Welcome',
  'You looks bad',
  'Free',
  'Shake me',
  'you',
  'Happy',
  'You looks good',
  'Thanks',
  'Buy it!'
];

export class SecondPartView extends PIXI.Container implements GarbageCollect {
  readonly name = 'second-part-container';
  private readonly _garbageBag = new GarbageBag();
  private readonly _spritesArray = new Array<PIXI.Sprite>();
  private readonly _nameOfSpritesArray = new Array<string>();
  private _timeout: NodeJS.Timeout | undefined;
  private _isRunning: boolean = false;
  private _contentContainer = new PIXI.Container();

  constructor() {
    super();
    this.visible = false;
    this._contentContainer.visible = false;
    this._contentContainer.position.set(70, 150);

    this.createArrayContent();

    this.addChild(this._contentContainer);
  }

  cleanGarbageCollect(): void {
    this._garbageBag.cleanGarbageCollect();
  }

  show(): void {
    this.visible = true;
    this._isRunning = false;
  }

  hide(): void {
    this.visible = false;
    this._contentContainer.removeChildren();
    if (this._timeout) {
      clearTimeout(this._timeout);
    }
  }

  clickPlayButton(): void {
    if (this._isRunning) {
      return;
    }
    this._isRunning = true;
    this.runAnimation().then(() => (this._isRunning = false));
  }

  private runAnimation(index: number = 10): Promise<void> {
    if (index < 0) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      this._timeout = setTimeout(() => {
        this.loadContent();
        this._contentContainer.visible = true;
        return this.runAnimation(index - 1).then(() => resolve());
      }, 2000);
    });
  }

  private loadContent(): void {
    this._contentContainer.removeChildren();
    repeat(3).map((value) => {
      const randomElement = getRandom(0, this._spritesArray.length - 1);
      const nameOfTexture = this._nameOfSpritesArray[randomElement];
      const element = fromCacheAsSprite(nameOfTexture);
      element.position.set(value * 120, 0);
      element.anchor.set(0.5);
      this._contentContainer.addChild(element);
    });
  }

  private createArrayContent(): void {
    repeat(6).map((value) => {
      const nameOfTexture = 'icon-' + value;
      const icon = fromCacheAsSprite('icon-' + value);
      this._nameOfSpritesArray.push(nameOfTexture);
      this._spritesArray.push(icon);
    });

    defaultGlyphs.forEach((value, index) => {
      this._spritesArray.push(this.buildLetters(value, index));
    });
  }

  private buildLetters(letter: string, index: number): PIXI.Sprite {
    const text = new PIXI.Text(letter, {
      fontSize: getRandom(10, 35),
      fill: 0xffffff,
      align: 'center',
      wordWrap: true
    });
    text.updateText(true);
    const nameOfTexture = index + 6;
    this._nameOfSpritesArray.push('icon-' + nameOfTexture);
    PIXI.Texture.addToCache(text.texture, 'icon-' + nameOfTexture);
    return new PIXI.Sprite(text.texture);
  }
}
