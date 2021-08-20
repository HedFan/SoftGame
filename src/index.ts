import { GameViewImpl } from './views';

const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x2c3e50
});
document.body.appendChild(app.view);

const gameContainer = new GameViewImpl();
gameContainer.initialize();

app.stage.addChild(gameContainer);

