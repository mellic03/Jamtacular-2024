import Actor from "../../engine/actor.js";
import { Engine, __engine } from "../../engine/engine.js";
import FABRIK from "../../engine/math/FABRIK.js";
import { math } from "../../engine/math/math.js";
import vec2 from "../../engine/math/vec2.js";
import sys_Image from "../../engine/sys-image.js";
import sys_World, { HitInfo } from "../../engine/sys-world.js";
import BodyPart from "./bodypart.js";



export class LegParams
{
    foot_xoffset:   number;
    foot_maxdist:   number;
    step_overshoot: number;
    step_duration:  number;
    step_height:    number;
    rest_height:    number;

    constructor( foot_xoffset=0, foot_maxdist=512, step_overshoot=0.25,
                 step_duration=0.2, step_height=16, rest_height=0.95 )
    {
        this.foot_xoffset   = foot_xoffset;
        this.foot_maxdist   = foot_maxdist;
        this.step_overshoot = step_overshoot;
        this.step_duration  = step_duration;
        this.step_height    = step_height;
        this.rest_height    = rest_height;
    }

}



export default class BodyPartLeg extends BodyPart
{
    params = new LegParams();

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

    other: BodyPartLeg = null;

    constructor( x: number, y: number, dists: Array<number>, alpha_offset=0 )
    {
        super(x, y);

        this.offset = alpha_offset;

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


    step( engine: Engine, force: boolean = false )
    {
        const a0 = this.getAlpha();
        const a1 = this.other.getAlpha();
        const can_move = (a1 > 1) && (a0 > a1);

        if (a0 < 1.0 || can_move == false && force == false)
        {
            return;
        }

        let xoffset  = this.params.step_overshoot * this.parent.vel.x;
            // xoffset += Math.sign(this.parent.vel.x) * this.params.step_overshoot;

        const world = engine.getSystem(sys_World);
        if (world.raycast(this.root.x + xoffset, this.y, 0.001, 1))
        {
            const res = HitInfo.res;
            const dx  = (res.x - this.next.x);
            const dy  = (res.y - this.next.y);

            this.curr.copy(this.next);
            this.next.addXY(dx, dy);
            this.timer = 0.0;
        }
    }


    private computeFootHeight( alpha: number )
    {
        return this.params.step_height * Math.sin(Math.PI * alpha);
    }

    getAlpha(): number
    {
        this.alpha  = (this.timer / this.params.step_duration);
        this.alpha  = math.clamp(this.alpha, 0, 1);

        this.alpha2 = this.offset + (this.timer / this.params.step_duration);
        this.alpha2 = math.clamp(this.alpha2, 0, 1);

        return this.alpha2;
    }

    getRestHeight()
    {
        const hip_y   = this.parent.y;
        const foot_y  = this.computeFootHeight(this.alpha);
        const desired = foot_y - (this.params.rest_height * this.tdist);
        const error   = desired - hip_y;

        return error;
    }

    getBalance()
    {
        const xmin = math.min(this.next.x, this.other.next.x);
        const xmax = math.max(this.next.x, this.other.next.x);
        const dx   = 0.0; // this.parent.getDelta().x;

        return  (xmin-dx < this.parent.x) && (this.parent.x < xmax+dx);
    }

    update( engine: Engine )
    {
        super.update(engine);
    
        this.timer += engine.dtime();
        const alpha = this.getAlpha();

        if (this.getBalance() == false)
        {
            this.step(engine);
        }

        if (Math.abs(this.root.x - this.foot.x) > this.params.foot_maxdist)
        {
            this.step(engine, true);
        }

        if (this.alpha <= 1.0)
        {
            this.foot.copy(this.curr);
            this.foot.mix(this.next, this.alpha);
            this.foot.y -= this.computeFootHeight(this.alpha);
        }

        this.root.copy(this.pos);

        if (Math.sign(this.root.x - this.joints[1].x) == Math.sign(this.direction))
        {
            this.joints[1].x -= this.root.x;
            this.joints[1].x *= -1;
            this.joints[1].x += this.root.x;
        }

        FABRIK(this.joints, this.dists, this.tdist, 2);
    }

    draw( engine: Engine )
    {
        imageMode(CORNER);
        const imgsys = engine.getSystem(sys_Image);
        const img = imgsys.load("assets/img/meat.jpg");

        fill(0, 0, 255);
        circle(this.next.x, this.next.y, 5);

        fill(50);
        stroke(150);

        for (let i=1; i<this.joints.length; i++)
        {
            const A = this.joints[i-1];
            const B = this.joints[i];


            push();

            vec2.temp.displacement(A, B);
            const dist  = vec2.temp.mag();
            const theta = atan2(B.y-A.y, B.x-A.x);
            translate(A.x, A.y);
            rotate(theta);
            image(img, 0, -8, dist, 16);

            pop();
        }

        strokeWeight(1);
    }

}

