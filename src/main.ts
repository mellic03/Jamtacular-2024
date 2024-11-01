import {} from "p5/global";
import {} from "p5/lib/addons/p5.sound";
import {} from "../lib/p5/addons/p5play";

import { __engine } from "./engine/engine.js";
import { Game } from "./game/game.js";


const engine = __engine;
engine.init(1920, 1080);

const game = new Game();


function preload()
{
    engine.preload();
}


function setup()
{
    engine.setup();

    world.gravity.y = 9.8;
    allSprites.autoDraw = false;
}


function draw()
{
    engine.draw();
}


window.preload = preload;
window.setup   = setup;
window.draw    = draw;

