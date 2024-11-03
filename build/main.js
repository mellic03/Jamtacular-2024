import { Engine } from "./engine/engine.js";
import { Game } from "./game/game.js";
import { Render, RenderEvent } from "./engine/render.js";
import { CharacterController } from "./game/controller/controller.js";
Engine.init(1920, 1080, 144);
const game = new Game();
function preload() {
    Engine.preload();
    game.preload();
}
function setup() {
    Engine.setup();
    game.setup();
    // Render.on(RenderEvent.WINDOW_RESIZE, (w, h) => {
    //     Render.resize(w, h);
    // });
    world.gravity.y = 9.8;
    allSprites.autoDraw = false;
    Render.emit(RenderEvent.WINDOW_RESIZE, windowWidth, windowHeight);
}
function draw() {
    Engine.draw();
    game.update();
    CharacterController.updateAll();
}
window.preload = preload;
window.setup = setup;
window.draw = draw;
//# sourceMappingURL=main.js.map