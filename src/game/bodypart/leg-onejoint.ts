import Actor from "../../engine/actor.js";
import { Engine, __engine } from "../../engine/engine.js";
import FABRIK from "../../engine/math/FABRIK.js";
import { math } from "../../engine/math/math.js";
import vec2 from "../../engine/math/vec2.js";
import sys_World from "../../engine/sys-world/sys-world.js";
import BodyPartLeg from "./leg.js";



export default class LegOneJoint extends BodyPartLeg
{
    constructor( x: number, y: number, dists: Array<number>, lerp_offset=0)
    {
        super(x, y, dists, lerp_offset);
    }

    // step( engine: Engine )
    // {
    //     const a0 = this.getAlpha();
    //     const a1 = this.other.getAlpha();
    //     const can_move = (a1 > 1) && (a0 > a1);

    //     if (a0 < 1.0 || can_move == false)
    //     {
    //         return;
    //     }

    //     const dir = 32*this.parent.delta.x;
    //     const world = engine.getSystem(sys_World);
    //     world.raycast(this.root.x + this.foot_xrest - dir, this.y, 0, 1);

    //     const res = HitInfo.res;
    //     const dx  = (res.x - this.next.x) * (1.0 + this.step_overshoot);
    //     const dy  = (res.y - this.next.y) * (1.0 + this.step_overshoot);

    //     this.curr.copy(this.next);
    //     this.next.addXY(dx, dy);
    //     this.timer = 0.0;
    // }

    update()
    {
        // if (Math.sign(this.root.x - this.joints[1].x) == Math.sign(this.direction))
        // {
        //     this.joints[1].x -= this.root.x;
        //     this.joints[1].x *= -1;
        //     this.joints[1].x += this.root.x;
        // }

        super.update();
    }

    draw()
    {
        super.draw();
    }

}

