import {} from "p5/global";
import {} from "p5/lib/addons/p5.sound";
import {} from "../lib/p5/addons/p5play";

import { __engine } from "./engine/engine.js";
import { Game } from "./game/game.js";


const engine = __engine;
engine.init(1000, 700);

const game = new Game();


function preload()
{
    engine.preload();
    game.preload();
}


function setup()
{
    engine.setup();
    game.setup();

    frameRate(60)

    world.gravity.y = 9.8;
    allSprites.autoDraw = false;

    // const RE = SomeObject.Actor;

    // const A = new Jank.Actor(0, 0, 64, 64);
    // console.log("YEET: ", A);
}




function draw()
{
    engine.draw();
}


window.preload = preload;
window.setup   = setup;
window.draw    = draw;

