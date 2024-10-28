import { Engine, __engine } from "../../engine/engine.js";
import BodyPartLeg from "./leg.js";
import LegController from "./leg-controller.js";
import Actor from "../../engine/actor.js";
import LegTwoJoint from "./leg-twojoint.js";
import { EventEmitting } from "../../engine/sys-event.js";
import { IO, KEYCODE } from "../../engine/IO.js";
import { math } from "../../engine/math/math.js";
import LegOneJoint from "./leg-onejoint.js";
import sys_World, { HitInfo } from "../../engine/sys-world.js";
import vec2 from "../../engine/math/vec2.js";



export default class LegControllerBiped extends LegController
{
    hi_height = 0.9;
    lo_height = 0.65;

    heightfactor: number = 0;
    yoffset: number = 0;
    roffset: number = 0;

    constructor( parent: Actor & EventEmitting<number> )
    {
        super(parent);

        this.parent.event.on(KEYCODE.A, () => { this.setDirection(-1); });
        this.parent.event.on(KEYCODE.D, () => { this.setDirection(+1); });

        this.parent.event.on(KEYCODE.W, () => { this.heightfactor = this.hi_height; });
        this.parent.event.on(KEYCODE.S, () => { this.heightfactor = this.lo_height; });

        // this.addLeg(new LegTwoJoint(-16, 32, [35, 35, 85], 0.0));
        // this.addLeg(new LegTwoJoint(+16, 32, [35, 35, 85], 0.0));

        this.addLeg(new LegOneJoint(-8, 24, [40, 55], 0.0));
        this.addLeg(new LegOneJoint(+8, 24, [40, 55], 0.0));

        this.legs[0].other = this.legs[1];
        this.legs[1].other = this.legs[0];

        this.heightfactor = this.hi_height;
        this.yoffset = -this.heightfactor * this.legs[0].tdist;

        this.params.step_duration  = 0.25;
        this.params.foot_xoffset   = 64;
        this.params.step_overshoot = 0.3;
        this.params.step_height    = 32;
        this.setParams(this.params);
    }


    update( engine: Engine )
    {
        super.update(engine);

        const L = vec2.tmpA;
        const R = vec2.tmpB;

        const world = engine.getSystem(sys_World);

        if (!world.raycast(this.legs[0].root.x, this.legs[0].root.y, 0.025, +1, L))
        {
            return;
        }

        if (!world.raycast(this.legs[1].root.x, this.legs[1].root.y, 0.025, +1, R))
        {
            return;
        }

        const h = math.min(L.y-this.legs[0].yLocal, R.y-this.legs[1].yLocal);
        const a = math.clamp(8*engine.dtime(), 0, 1);

        this.yoffset  = -this.heightfactor * this.legs[0].tdist;
        this.parent.y = math.mix(this.parent.y, h+this.yoffset, a);
    }


    draw( engine: Engine )
    {
        super.draw(engine);

    }


}

