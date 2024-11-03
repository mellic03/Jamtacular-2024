import {} from "p5/global";
import {} from "p5/lib/addons/p5.sound";
import {} from "../lib/p5/addons/p5play";

import { Engine } from "./engine/engine.js";
import { Game } from "./game/game.js";
import Render from "./engine/sys-render.js";


Engine.init(1280, 720, 144);

const game = new Game();


function preload()
{
    Engine.preload();
    game.preload();
}


function setup()
{
    Engine.setup();
    Render.resize(windowWidth, windowHeight);
    game.setup();

    world.gravity.y = 9.8;
    allSprites.autoDraw = false;

}


function draw()
{
    Engine.draw();

    console.log(windowWidth, windowHeight);

}

function windowResized()
{
    Render.resize(windowWidth, windowHeight);
}

window.preload = preload;
window.setup   = setup;
window.draw    = draw;
window.windowResized    = windowResized;

