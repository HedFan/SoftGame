import { inject, injectable } from 'inversify';

import { APP_TYPES } from '../types';
import { GarbageBag, GarbageCollect, BucketRenderer } from '../components';
import { Size, TickerData, Updatable } from '../utils';

export interface Renderer extends Updatable {}
@injectable()
export class Renderer implements GarbageCollect, Renderer {
  private readonly _garbageBag = new GarbageBag();
  private readonly _renderer: PIXI.CanvasRenderer | PIXI.Renderer;
  private readonly _stage: PIXI.Container;
  private readonly _appContainer: PIXI.Container;

  constructor(@inject(APP_TYPES.BucketRenderer) private readonly _bucketRenderer: BucketRenderer) {
    const { devicePixelRatio } = this._bucketRenderer;

    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    this._renderer = PIXI.autoDetectRenderer({
      width: window.innerWidth,
      height: window.innerHeight,
      resolution: devicePixelRatio,
      backgroundColor: 0x2c3e50,
      forceCanvas: true,
      autoDensity: true,
      transparent: true
    });

    this._stage = new PIXI.Container();
    this._stage.name = 'stage';

    this._appContainer = new PIXI.Container();
    this._appContainer.name = 'root-content-container';
    this._stage.addChild(this._appContainer);

    document.body.appendChild(this._renderer.view);
    this._garbageBag.completable$(this._bucketRenderer.resize$).subscribe(({ screenSize }) => {
      this.resize(screenSize);
    });
  }

  cleanGarbageCollect(): void {
    this._garbageBag.cleanGarbageCollect();
  }

  update(tickerData: TickerData): void {
    this._renderer.render(this._stage);
  }

  addContainer(container: PIXI.Container): void {
    this._appContainer.addChild(container);
  }

  private resize(size: Size): void {
    this._renderer.resize(size.width, size.height);
    this._renderer.view.style.width = `${size.width}px`;
    this._renderer.view.style.height = `${size.height}px`;

    const { bucketPosition, scaleRatio } = this._bucketRenderer;
    this._appContainer.scale.set(scaleRatio);
    this._appContainer.position.set(bucketPosition.x, bucketPosition.y);
  }
}
