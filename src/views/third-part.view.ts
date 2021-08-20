import { GarbageBag, GarbageCollect } from '../utils';

export class ThirdPartView extends PIXI.Container implements GarbageCollect {
    readonly name = 'third-part-vew';
    private readonly _garbageBag = new GarbageBag();
    private readonly _simpleText: PIXI.Text;

    constructor() {
        super();
        this.visible = false;

        this._simpleText = new PIXI.Text('Sorry, but I have nothing here 😐', { fill: 0xffffff, fontSize: 20 });
        this._simpleText.position.set(60, 90);
        this._simpleText.visible = false;

        this.addChild(this._simpleText);
    }

    cleanGarbageCollect(): void {
        this._garbageBag.cleanGarbageCollect();
    }

    show(): void {
        this.visible = true;
    }

    hide(): void {
        this.visible = false;
        this._simpleText.visible = false;
    }

    clickPlayButton(): void {
        this._simpleText.visible = true;
    }
}
