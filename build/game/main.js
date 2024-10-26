import Engine from "../engine/engine.js";
import Block from "./block.js";
import Player from "./player.js";
import { IO } from "../engine/IO.js";
import { Audio } from "../engine/audio.js";
import StateMainMenu from "./gamestate/UI-menu/mainmenu.js";
import StateGameplay from "./gamestate/state-gameplay.js";
import StateInGameUI from "./gamestate/UI-ingame/ingame-ui.js";
import { ImgManager } from "../engine/image.js";
import { WorldGrid } from "../engine/worldgrid.js";
const engine = new Engine(1920, 1080);
const GameScene = new StateGameplay(engine, "gameplay", engine.getRootState());
const MainMenuScene = new StateMainMenu(engine, "mainmenu", engine.getRootState());
const GameUIScene = new StateInGameUI(engine, "gameui", engine.getRootState());
let player;
let world;
function preload() {
    Audio.preload();
    ImgManager.preload();
    engine.preload();
}
function setup() {
    engine.setup();
    world = new WorldGrid(engine.ren, 512, 2);
    world.curr_sector.addNeighbour(0, -1);
    world.curr_sector.addNeighbour(-1, 0);
    world.curr_sector.addNeighbour(-1, -1);
    // world.curr_sector.addNeighbour(-1, +1);
    // world.curr_sector.addNeighbour( 0, +1);
    // world.curr_sector.addNeighbour( 0, +2);
    // world.curr_sector.addNeighbour(+1,  0);
    // world.curr_sector.addNeighbour(+1, +1);
    // world.curr_sector.addNeighbour(+1, +2);
    // world.curr_sector.addNeighbour(+2,  0);
    // world.curr_sector.addNeighbour(+2, +1);
    // world.curr_sector.addNeighbour(+2, +2);
    const GS = engine.getRootState();
    GS.addChildState(GameScene, true);
    GS.addChildState(MainMenuScene, true);
    GS.addChildState(GameUIScene, false);
    for (let i = 0; i < 10; i++) {
        GameScene.addActor(new Block(512 * random(-1, +1), 512 * random(-1, +1)));
    }
    player = GameScene.addActor(new Player(0, 0, engine));
}
function draw() {
    background(20);
    // background(200, 200, 200, 255);
    engine.update();
    engine.ren.renderWorldGridSector(player.camera, world.curr_sector);
    engine.draw(player.camera);
    engine.ren.postProcess();
    stroke(0);
    textAlign(LEFT, CENTER);
    textSize(24);
    text(`fps: ${engine.ren.avgFPS()}`, -500, -380);
    text(`x, y: ${player.transform.x}, ${player.transform.y}`, -500, -350);
    if (IO.keyDown(IO.keycodes.ESC)) {
        GameUIScene.transition("mainmenu");
    }
}
window.preload = preload;
window.setup = setup;
window.draw = draw;
//# sourceMappingURL=main.js.map