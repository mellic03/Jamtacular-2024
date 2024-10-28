import { Engine, __engine } from "../../engine/engine.js";
import { IO, KEYCODE } from "../../engine/IO.js";
import vec2 from "../../engine/math/vec2.js";
import sys_Render from "../../engine/sys-render.js";
import Character from "./character.js";


export default class PlayerController
{
    constructor()
    {

    }

    update( engine: Engine, C: Character )
    {
        const delta = vec2.temp.setXY(0, 0);

        if (IO.keyDown(KEYCODE.A))
        {
            delta.x = -1;
        }

        if (IO.keyDown(KEYCODE.D))
        {
            delta.x = +1;
        }

        if (IO.keyDown(KEYCODE.W))
        {
            delta.y = -1;
        }

        if (IO.keyDown(KEYCODE.S))
        {
            delta.y = +1;
        }

        C.move(delta.x, delta.y);

        const ren = engine.getSystem(sys_Render);
        ren.view.mix(C.pos, 0.05);

    }

}
