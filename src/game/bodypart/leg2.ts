import { __engine } from "../../engine/engine.js";
import FABRIK from "../../engine/math/FABRIK.js";
import { math } from "../../engine/math/math.js";
import vec2 from "../../engine/math/vec2.js";
import sys_Image from "../../engine/sys-image.js";
import Render from "../../engine/sys-render.js";
import sys_Render from "../../engine/sys-render.js";
import { WorldQueryResult } from "../../engine/sys-world/query.js";
import { GS_World } from "../state/world/world.js";
import BodyPart from "./bodypart.js";



export class LegParams
{
    foot_xoffset:   number;
    foot_maxdist:   number;
    step_overshoot: number;
    step_duration:  number;
    step_height:    number;
    rest_height:    number;

    constructor( foot_xoffset=0, foot_maxdist=256, step_overshoot=300,
                 step_duration=0.25, step_height=32, rest_height=0.95 )
    {
        this.foot_xoffset   = foot_xoffset;
        this.foot_maxdist   = foot_maxdist;
        this.step_overshoot = step_overshoot;
        this.step_duration  = step_duration;
        this.step_height    = step_height;
        this.rest_height    = rest_height;
    }

}



export default class BodyPartLeg2 extends BodyPart
{
    params = new LegParams();

    joints: Array<vec2>;
    dists:  Array<number>;
    tdist:  number;

    root: vec2;
    foot: vec2;

    target    = new vec2(0, 0);
    prev_foot = new vec2(0, 0);
    next_foot = new vec2(0, 0);

    timer:  number = 0.0;
    alpha:  number = 0.0;
    alpha2: number = 0.0;
    offset: number;

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

    private computeFootHeight( alpha: number )
    {
        return this.params.step_height * Math.sin(Math.PI * alpha);
    }


    private step()
    {
        // if (GS_Gameplay.world == null)
        // {
        //     return;
        // }

        const offset = this.direction * this.params.step_overshoot;

        if (GS_World.raycast(this.world.x+offset, this.world.y, 0.0001, 1.0))
        {
            const res = WorldQueryResult.hit;

            this.prev_foot.copy(this.foot);
            this.next_foot.copy(res);
            this.timer = 0;
        }
    }


    getAlpha(): number
    {
        this.alpha  = (this.timer / this.params.step_duration);
        this.alpha  = math.clamp(this.alpha, 0, 1);

        this.alpha2 = (this.timer / this.params.step_duration);
        this.alpha2 = this.offset + math.clamp(this.alpha2, 0, 1);

        return this.alpha2;
    }

    getRestHeight()
    {
        const hip_y   = this.world.y;
        const foot_y  = this.computeFootHeight(this.alpha);
        const desired = foot_y - (this.params.rest_height * this.tdist);
        const error   = desired - hip_y;

        return error;
    }

    // getBalance()
    // {
    //     const xmin = math.min(this.next_foot.x, this.other.next_foot.x);
    //     const xmax = math.max(this.next_foot.x, this.other.next_foot.x);
    //     const dx   = 0.0; // this.parent.getDelta().x;

    //     return true;
    //     // return  (xmin-dx < this.transform.parent.x) && (this.transform.parent.x < xmax+dx);
    // }

    isGrounded(): boolean
    {
        return (this.foot.distSq(this.next_foot) < 16);
    }

    update()
    {
        super.update();

        const dx = Math.abs(this.world.x - this.foot.x);
    
        if (this.timer > this.params.step_duration + this.offset &&  dx > this.params.foot_maxdist)
        {
            this.step();
        }
    
        const mworld = Render.worldMouse();
        this.direction = Math.sign(mworld.x - this.root.x);

        if (Math.sign(this.world.x - this.joints[1].x) == Math.sign(this.direction))
        {
            this.joints[1].x -= this.world.x;
            this.joints[1].x *= -1;
            this.joints[1].x += this.world.x;
        }


        this.timer += deltaTime / 1000.0;
        this.alpha = math.clamp(this.timer / this.params.step_duration, 0, 1);

        this.foot.copy(this.prev_foot).mix(this.next_foot, this.alpha);
        this.foot.y -= this.computeFootHeight(this.alpha);

        this.root.copy(this.world.pos);

        FABRIK(this.joints, this.dists, this.tdist, 2);
    }

    draw()
    {
        imageMode(CORNER);
        const imgsys = __engine.getSystem(sys_Image);
        const img = imgsys.load("assets/img/meat.jpg");

        // fill(0, 255, 0);
        // circle(this.curr_foot.x, this.curr_foot.y, 5);

        // fill(0, 0, 255);
        // circle(this.next_foot.x, this.next_foot.y, 5);

        fill(50);
        stroke(150);

        for (let i=0; i<this.joints.length-1; i++)
        {
            const A = this.joints[i];
            const B = this.joints[i+1];
            const dist = vec2.tmp().displacement(A, B).mag();

            sys_Render.imageRotated(
                img, 0, -8, dist, 16, A, B
            );
        }

        strokeWeight(1);
    }

}

