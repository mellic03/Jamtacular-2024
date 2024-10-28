import {} from "p5/global";
import {} from "p5/lib/addons/p5.sound";
import { Engine, __engine } from "./engine/engine.js";
import Game from "./game/game.js";
import sys_Render from "./engine/sys-render.js";
import { math } from "./engine/math/math.js";



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
}


function draw()
{
    engine.draw();
    const ren = engine.getSystem(sys_Render);

    stroke(255);
    fill(255);
    textSize(24);
    text(`fps: ${ren.avgFPS()}`, -300, -300);

    // group.draw(3, [50, 50, 200], 2);
    // group.draw(2, [200, 50, 200], 2);
    // group.draw(1, [200, 50, 50], 4);
    // group.draw(0, [50, 200, 50], 8);
}


function mouseWheel( event )
{
    const ren = engine.getSystem(sys_Render);
    ren.scale -= 0.001 * event.delta;
    ren.scale = math.clamp(ren.scale, 0.05, 2.0);
}


window.preload = preload;
window.setup   = setup;
window.draw    = draw;
window.mouseWheel    = mouseWheel;

