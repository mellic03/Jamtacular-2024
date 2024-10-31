import Actor from "../../engine/actor.js";
import { Engine, __engine } from "../../engine/engine.js";
import FABRIK from "../../engine/math/FABRIK.js";
import { math } from "../../engine/math/math.js";
import vec2 from "../../engine/math/vec2.js";
import sys_World from "../../engine/sys-world/sys-world.js";
import BodyPart from "./bodypart.js";


export default class BodyPartArm extends BodyPart
{
    direction:      number = +1;
    yoffset:        number = 0;

    swing_overshoot: number;
    swing_duration:  number;
    swing_height:    number;
    rest_height:    number = 0.8;

    joints: Array<vec2>;
    dists:  Array<number>;
    tdist:  number;
    root: vec2;
    foot: vec2;

    timer:  number = 0.0;
    alpha:  number = 0.0;
    alpha2: number = 0.0;
    offset: number;

    target = new vec2(0, 0);
    curr   = new vec2(0, 0);
    next   = new vec2(0, 0);

    constructor( x: number, y: number, xrest: number, offset: number, dists: Array<number>,
                 overshoot=0.9, duration=0.2, height=32 )
    {
        super(x, y);

        this.offset          = offset;
        this.swing_overshoot = overshoot;
        this.swing_duration  = duration;
        this.swing_height    = height;


        this.joints = []; // [new vec2(0, 0), new vec2(0, 25), new vec2(15, 35)];
        this.dists  = dists;

        for (let i=0; i<=dists.length; i++)
        {
            this.joints.push(new vec2(Math.random(), Math.random()));
        }

        this.tdist = 0.0;
        for (let dist of this.dists)
        {
            this.tdist += dist;
        }

        this.root = this.joints[0];
        this.foot = this.joints[this.joints.length-1];
    }

    private _step( engine: Engine )
    {

    }

    swing( engine: Engine )
    {

    }


    private computeHandHeight( alpha: number )
    {
        return this.swing_height * Math.sin(Math.PI * alpha);
    }

    getAlpha(): number
    {
        this.alpha  = (this.timer / this.swing_duration);
        this.alpha  = math.clamp(this.alpha, 0, 1);
        return this.alpha;
    }

    getRestHeight()
    {
        const hip_y   = this.root.y;
        const foot_y  = this.foot.y;
        const desired = foot_y - (this.rest_height * this.tdist);
        const error   = desired - hip_y;

        return 0.5 * error;
    }


    update()
    {
        super.update();

        // this.timer += 0.0001 * this.delta.x;
        // this.yoffset = Math.sin(this.timer);

        // const tmp = vec2.tmp();

        // tmp.copy(this.posWorld);
        // const dx = 0.2 * this.parent.vel.x; // Math.sign(this.xLocal);

        // this.foot.copy(this.posWorld);
        // this.foot.addXY(0.2*dx, 64);
    
        // this.joints[1].subXY(dx, 0.0);

        // this.root.copy(this.pos);
        // this.root.y += this.yoffset;

        // FABRIK(this.joints, this.dists, this.tdist, 1);
    }

    draw()
    {
        stroke(200);

        for (let i=1; i<this.joints.length; i++)
        {
            const A = this.joints[i-1];
            const B = this.joints[i];

            strokeWeight(8 - 2*i);
            line(A.x, A.y, B.x, B.y);
        }

        fill(255, 0, 255);
        circle(this.foot.x, this.foot.y, 10);

        // const dir = 8*this.parent.getDelta().x;
        stroke(255, 0, 0);
        strokeWeight(4);
    
        strokeWeight(1);
    }

}

