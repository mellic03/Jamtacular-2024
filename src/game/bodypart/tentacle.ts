import Actor from "../../engine/actor.js";
import { Engine, __engine } from "../../engine/engine.js";
import FABRIK from "../../engine/math/FABRIK.js";
import { math } from "../../engine/math/math.js";
import vec2 from "../../engine/math/vec2.js";
import CollisionGroup from "../../engine/physics/group.js";
import RigidBody from "../../engine/physics/rigidbody.js";
import Rope from "../../engine/physics/rope.js";
import sys_Image from "../../engine/sys-image.js";
import sys_Physics from "../../engine/sys-physics.js";
import sys_World, { HitInfo } from "../../engine/sys-world.js";
import BodyPart from "./bodypart.js";




export default class BodyPartTentacle extends BodyPart
{
    rope:   Rope;
    // joints: Array<vec2>;
    // dists:  Array<number>;
    root:   RigidBody;
    hand:   RigidBody;

    target = new vec2(0, 0);
    curr   = new vec2(0, 0);
    next   = new vec2(0, 0);

    grabbing   = false;
    grab_timer = 0.0;

    constructor( group: CollisionGroup, x: number, y: number, segments=8, length=32 )
    {
        super(x, y);

        this.rope = new Rope(group, x, y, segments, length, 8, 0.0);
        this.root = this.rope.bodies[0];
        this.hand = this.rope.bodies[this.rope.bodies.length-1];
    }


    private update_grab()
    {
        if (this.grabbing == true)
        {
            if (this.hand.pos.distSq(this.target) > 32*32)
            {
                this.grab_timer += deltaTime;
            }

            else
            {
                this.grab_timer = 0;
            }

            if (this.grab_timer > 1500)
            {
                this.grabbing = false;
            }

            this.hand.moveTo(this.target, 0.01);
            // this.hand.setPosition(this.target);
        }

        else
        {
            this.grab_timer = 0;
        }
    
    }


    update( engine: Engine )
    {
        this.root.setPosition(this.transform.worldpos);
        this.update_grab();
    }


    draw( engine: Engine )
    {
        stroke(25);

        this.rope.draw(engine);

        // for (let i=1; i<this.joints.length; i++)
        // {
        //     const A = this.joints[i-1];
        //     const B = this.joints[i];

        //     strokeWeight(this.joints.length - i);
        //     line(A.x, A.y, B.x, B.y);

        // }

        strokeWeight(1);
    }


    reachFor( position: vec2 ): boolean
    {
        if (position.distSq(this.root.pos) > this.rope.tdist*this.rope.tdist)
        {
            return;
        }

        this.target.copy(position);
        this.grabbing = true;
        return;

        const world = __engine.getSystem(sys_World);
        const dir   = vec2.temp.normalizedDirection(this.hand.pos, position);

        if (world.raycast(this.hand.x, this.hand.y, dir.x, dir.y))
        {
            const res = HitInfo.res;

            if (this.hand.pos.dist(res) < this.rope.tdist)
            {
                this.target.copy(res);
                return true;
            }
        }

        return false;
    }

    reach( dir: vec2 ): boolean
    {
        const world = __engine.getSystem(sys_World);

        if (world.raycast(this.root.x, this.root.y, dir.x, dir.y))
        {
            const res = HitInfo.res;

            if (this.root.pos.dist(res) < this.rope.tdist && this.hand.lerp_pos.dist(res) > 32.0)
            {
                circle(res.x, res.y, 20);
                this.target.copy(res);
                return true;
            }
        }

        return false;
    }


    isGrabbing(): boolean
    {
        return this.grabbing;
    }

}

