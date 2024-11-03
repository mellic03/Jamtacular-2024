import { IO, KEYCODE } from "../../engine/IO.js";
import vec2 from "../../engine/math/vec2.js";
import { Render } from "../../engine/render.js";
import { CharacterController } from "./controller.js";
export default class PlayerController extends CharacterController {
    constructor() {
        super();
        this.body = null;
        this.cam_offset = new vec2(0, 0);
        IO.onMouseClick(() => {
            if (!this.body) {
                return;
            }
            const wmouse = Render.worldMouse();
            console.log(wmouse.x, wmouse.y);
            this.body.interact(wmouse.x, wmouse.y, "hello");
        });
    }
    key_rotation(C) {
        let theta = 0.0;
        let speed = 0.02;
        if (IO.keyDown(KEYCODE.Q)) {
            theta -= 1;
        }
        if (IO.keyDown(KEYCODE.E)) {
            theta += 1;
        }
        C.rotate(speed * theta);
    }
    key_movement(C) {
        const delta = vec2.tmp().setXY(0, 0);
        const speed = 1.0;
        if (IO.keyDown(KEYCODE.A)) {
            delta.x = -1;
        }
        if (IO.keyDown(KEYCODE.D)) {
            delta.x = +1;
        }
        if (IO.keyDown(KEYCODE.W)) {
            delta.y = -1;
        }
        if (IO.keyDown(KEYCODE.S)) {
            delta.y = +1;
        }
        if (IO.keyDown(KEYCODE.SPACE)) {
            C.jump();
        }
        C.move(delta.x, delta.y);
    }
    mouse_movement(C) {
        // const dx = 
        // const temp = vec2.tmp(un_texture, vec2.xy(), 0).rgb;
        // this.cam_offset.addXy()
    }
    update(C) {
        Render.view.mixXY(C.local.x, C.local.y, 0.02);
        if (this.is_good == false) {
            return;
        }
        this.key_rotation(C);
        this.key_movement(C);
        this.body = C;
    }
}
//# sourceMappingURL=controller-player.js.map