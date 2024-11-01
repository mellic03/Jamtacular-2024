import { __engine } from "../../engine/engine.js";
import { IO, KEYCODE } from "../../engine/IO.js";
import vec2 from "../../engine/math/vec2.js";
import Render from "../../engine/sys-render.js";
import { iCharacterController, iControllable } from "./controller.js";


export default class PlayerController implements iCharacterController
{
    constructor()
    {

    }

    private key_rotation( C: iControllable )
    {
        let theta = 0.0;
        let speed = 0.02;

        if (IO.keyDown(KEYCODE.Q))
        {
            theta -= 1;
        }

        if (IO.keyDown(KEYCODE.E))
        {
            theta += 1;
        }

        C.rotate(speed*theta);
    }


    private key_movement( C: iControllable )
    {
        const delta = vec2.tmp().setXY(0, 0);
        const speed = 1.0;

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

        if (IO.keyDown(KEYCODE.SPACE))
        {
            C.jump();
        }

        C.move(speed*delta.x, speed*delta.y);
    }


    update( C: iControllable )
    {
        this.key_rotation(C);
        this.key_movement(C);

        if (IO.mouseClicked())
        {
            const wmouse = Render.worldMouse();
            console.log(wmouse.x, wmouse.y);
            C.interact(wmouse.x, wmouse.y, "hello");
        }

        Render.view.mixXY(C.local.x, C.local.y, 0.5);
    }

}
