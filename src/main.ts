import {} from "p5/global";
import {} from "p5/lib/addons/p5.sound";
import {} from "../lib/p5/addons/p5play";

import { __engine } from "./engine/engine.js";
import ProjectileManager from "./engine/sys-projectile.js";
import { RootScene } from "./game/game.js";



const engine = __engine;
engine.init(1920, 1080);

const game = new RootScene();


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
    ProjectileManager.draw();
}


window.preload = preload;
window.setup   = setup;
window.draw    = draw;

