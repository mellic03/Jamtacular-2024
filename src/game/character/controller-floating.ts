import { __engine } from "../../engine/engine.js";
import { IO, KEYCODE } from "../../engine/IO.js";
import vec2 from "../../engine/math/vec2.js";
import Render from "../../engine/sys-render.js";
import { RigidBodyCharacter } from "./character.js";
import { iCharacterController } from "./controller.js";

enum State {
    Idle,
    Charging
};

export default class FloatingController implements iCharacterController
{
    private state = State.Idle;

    private key_movement(C: RigidBodyCharacter )
    {
        const delta = vec2.tmp().setXY(0, 0);
        const speed = 1.0;


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
