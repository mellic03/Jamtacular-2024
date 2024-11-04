import {} from "p5/global";
import {} from "p5/lib/addons/p5.sound";
import {} from "../lib/p5/addons/p5play";

import { Engine } from "./engine/engine.js";
import { Game } from "./game/game.js";
import { Render, RenderEvent } from "./engine/render.js";
import { CharacterController } from "./game/controller/controller.js";
import { math } from "./engine/math/math.js";


Engine.init(612, 612, 144);

const game = new Game();


function preload()
{
    Engine.preload();
    game.preload();

}


function setup()
{
    Engine.setup();
    game.setup();

    Render.on(RenderEvent.WINDOW_RESIZE, (w, h) => {
        Render.resize(w-64, h-64);
    });
    
    world.gravity.y = 9.8;
    allSprites.autoDraw = false;

    Render.emit(RenderEvent.WINDOW_RESIZE, windowWidth, windowHeight);

}


function draw()
{
    Engine.draw();
    game.update();

    CharacterController.updateAll()
}


window.preload = preload;
window.setup   = setup;
window.draw    = draw;

