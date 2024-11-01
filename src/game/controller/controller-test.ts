import { __engine } from "../../engine/engine.js";
import { IO, KEYCODE } from "../../engine/IO.js";
import vec2 from "../../engine/math/vec2.js";
import Render from "../../engine/sys-render.js";
import { RigidBodyCharacter } from "../character/Character.js";
import { iCharacterController } from "./controller.js";


export default class TestController implements iCharacterController
{
    private key_movement(C: RigidBodyCharacter )
    {
        const delta = vec2.tmp().setXY(0, 0);
        const speed = 1.0;

        if (IO.keyDown(KEYCODE.LEFT))
        {
            delta.x = -1;
        }

        if (IO.keyDown(KEYCODE.RIGHT))
        {
            delta.x = +1;
        }

        if (IO.keyDown(KEYCODE.UP))
        {
            delta.y = -1;
        }

        if (IO.keyDown(KEYCODE.DOWN))
        {
            delta.y = +1;
        }

        C.move(speed*delta.x, speed*delta.y);
    }

    update( C: RigidBodyCharacter )
    {
        this.key_movement(C);

        if (IO.mouseClicked())
        {
            const wmouse = Render.worldMouse();
            console.log(wmouse.x, wmouse.y);
            C.interact(wmouse.x, wmouse.y, "hello");
        }
    }

}
