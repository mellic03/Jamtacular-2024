import {} from "p5/global";
import {} from "p5/lib/addons/p5.sound";
import {} from "../lib/p5/addons/p5play";

import { __engine } from "./engine/engine.js";
import Game from "./game/game.js";
import sys_Render from "./engine/sys-render.js";
import { math } from "./engine/math/math.js";
import ProjectileManager from "./engine/sys-projectile.js";
import sys_World from "./engine/sys-world/sys-world.js";
import sys_Physics from "./engine/sys-physics.js";
import Render from "./engine/sys-render.js";
import vec2 from "./engine/math/vec2.js";



const engine = __engine;

engine.init(1920, 1080);
engine.addScene(new Game());


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
    // sys_Physics.GROUP_BASED_WORLD.draw([50, 255, 50], 2);

    // const tl   = vec2.tmp(-512, -512);
    // const span = vec2.tmp(1024, 1024);
    // fill(50, 200, 50);
    // rectMode(CORNER);
    // Render.rectCornerTest(tl, span);

    stroke(255);
    fill(255);
    textSize(24);
    Render.screenText(`fps: ${Render.avgFPS()}`, 100, 100);

}


function mouseWheel( event )
{
    const ren = Render;
    ren.scale -= 0.001 * event.delta;
    ren.scale = math.clamp(ren.scale, 0.05, 2.0);
}


window.preload = preload;
window.setup   = setup;
window.draw    = draw;
window.mouseWheel    = mouseWheel;

