import { GarbageBag, GarbageCollect, createButton, repeat, fromCacheAsSprite, getRandom } from '../utils';
// import { ParticleContainer } from 'pixi-particles';
// import particles = require('pixi-particles');
// import * as particles from 'pixi-particles'
const particles = require('pixi-particles')
import { Particle } from 'pixi-particles';
//", the PIXI namespace will
// not be modified, and may not exist - use "new particles.Emitter()",
const rendererOptions = {
    width: window.innerWidth,
    height: window.innerHeight
};
export class ThirdPartView extends PIXI.Container implements GarbageCollect {
    readonly name = 'third-part-vew';
    private readonly _garbageBag = new GarbageBag();
    private readonly _simpleText: PIXI.Text;
    private _particle = require('pixi-particles')
    // private _particle: Particle;
    // private readonly _particleContainer = new PIXI.Container();
    private readonly _particleContainer = new PIXI.ParticleContainer()
    private readonly _renderer = new PIXI.Renderer(rendererOptions);
    private _updateId: number | undefined;
    private _elapsed: number;

    constructor() {
        super();
        this.visible = false;
        this._elapsed = Date.now();

        this._simpleText = new PIXI.Text('Sorry, but I have nothing here 😐', { fill: 0xffffff, fontSize: 20 });
        this._simpleText.position.set(60, 90);
        this._simpleText.visible = false;

        this.addChild(this._simpleText);

        this._particle = new particles.Emitter (
            this._particleContainer,
            [fromCacheAsSprite('particle'), fromCacheAsSprite('fire')],
            {
                "alpha": {
                    "start": 0.62,
                    "end": 0
                },
                "scale": {
                    "start": 0.25,
                    "end": 0.75
                },
                "color": {
                    "start": "fff191",
                    "end": "ff622c"
                },
                "speed": {
                    "start": 500,
                    "end": 500
                },
                "startRotation": {
                    "min": 265,
                    "max": 275
                },
                "rotationSpeed": {
                    "min": 50,
                    "max": 50
                },
                "lifetime": {
                    "min": 0.1,
                    "max": 0.75
                },
                "blendMode": "normal",
                "frequency": 0.001,
                "emitterLifetime": 0,
                "maxParticles": 1000,
                "pos": {
                    "x": 0,
                    "y": 0
                },
                "addAtBack": false,
                "spawnType": "circle",
                "spawnCircle": {
                    "x": 0,
                    "y": 0,
                    "r": 10
                }
            });
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
        this._particle.destroy();
        if(this._updateId) {
            cancelAnimationFrame(this._updateId);
        }
    }

    clickPlayButton(): void {
        this._simpleText.visible = true;
    }
    private readonly updateAnimation = () => {
        let now = Date.now();
        if(this._particle){
            this._particle.update((now - this._elapsed) * 0.001);
        }
        this._elapsed = now;

        this._renderer.render(this._particleContainer);
        requestAnimationFrame(this.updateAnimation);
    };
}
