import {} from "p5/global";
import {} from "p5/lib/addons/p5.sound";
import {} from "../lib/p5/addons/p5play";

import { __engine } from "./engine/engine.js";
import { Game } from "./game/game.js";
// import { SomeObject } from "./engine/actor-SomeObject.js";
// import { Actor } from "./engine/actor";


const engine = __engine;
engine.init(1920, 1080);

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

    world.gravity.y = 9.8;
    allSprites.autoDraw = false;

    // const RE = SomeObject.Actor;

    // const A = new Jank.Actor(0, 0, 64, 64);
    // console.log("YEET: ", A);
}



let first = true;


function draw()
{
    if (first)
    {
        saveStrings(["A test", "B test"], "./test.json");
        first = false;
    }

    engine.draw();
}


window.preload = preload;
window.setup   = setup;
window.draw    = draw;

