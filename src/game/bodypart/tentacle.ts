import { __engine } from "../../engine/engine.js";
import vec2 from "../../engine/math/vec2.js";
import RigidBody from "../../engine/physics/rigidbody.js";
import Rope from "../../engine/physics/rope.js";
import BodyPart from "./bodypart.js";




class FloatRopes1 extends Rope
{
    aggression = 1.0;
    r_offset = 0.5 * (Math.random() * 0.5 + 0.5);
    g_offset = 0.5 * (Math.random() * 0.5 + 0.5);
    b_offset = 0.5 * (Math.random() * 0.5 + 0.5);

    drawSegments( start: number, end: number )
    {
        for (let i=start; i<end; i++)
        {
            const A = vec2.copy(this.bodies[i+0].pos);
            const B = vec2.copy(this.bodies[i+1].pos);

            this.bodies[i].sprite.gravityScale   = 0.75 * (1.0 - this.aggression) + 0.01;
            this.bodies[i+1].sprite.gravityScale = 0.75 * (1.0 - this.aggression) + 0.01;

            const a0 = i / this.bodies.length;
            const a1 = 0.002*this.bodies[i+1].vel.magSq();
            const a2 = a0*a1 * this.aggression;

            // strokeWeight(2*this.bodies.length - 8*a0);
            // strokeWeight(16 - 8*a0);
            strokeWeight(this.bodies[i].radius);
            // this.bodies[i+1].sprite.radius = 0.5 * (16 - 8*a0);

            const r = (50 + 100*a2)         * (1.0 + this.r_offset);
            const g = (50)                  * (1.0 + this.g_offset);
            const b = Math.max(50-50*a2, 0) * (1.0 + this.b_offset);

            stroke(r, g, b);

            line(A.x, A.y, B.x, B.y);
        }

        strokeWeight(1);
    }
}


class FloatRopes2 extends Rope
{
    aggression = 1.0;
    r_offset = 0.0 * (Math.random() * 0.5 + 0.5);
    g_offset = 0.0 * (Math.random() * 0.5 + 0.5);
    b_offset = 0.0 * (Math.random() * 0.5 + 0.5);

    drawSegments( start, end )
    {
        for (let i=start; i<end; i++)
        {
            const A = vec2.copy(this.bodies[i+0].pos);
            const B = vec2.copy(this.bodies[i+1].pos);


            const a0 = i / this.bodies.length;
            const a1 = 0.002*this.bodies[i+1].vel.magSq();
            const a2 = a0*a1 * this.aggression;

            strokeWeight(12 + 12*a0);
            // strokeWeight(16 - 8*a0);

            const r = (50 + 255*a2)         * (1.0 + this.r_offset);
            const g = (50)                  * (1.0 + this.g_offset);
            const b = Math.max(50-50*a2, 0) * (1.0 + this.b_offset);

            stroke(r, g, b);

            line(A.x, A.y, B.x, B.y);
        }

        strokeWeight(1);
    }
}



type FloatRopes = FloatRopes1;

export enum TentacleState
{
    Idle,
    MovingTo,
    Grabbing,
    Retracting
}


export default class BodyPartTentacle extends BodyPart
{
    state: TentacleState = TentacleState.Idle;

    rope: FloatRopes2;
    root: RigidBody;
    hand: RigidBody;

    grab_timer = 1.0;
    grabbing   = false;
    aggression = 0.0;

    constructor( x: number, y: number, ropegroup: Group, count,
                 length, mass, drag, thickness, grav,
                 lengthFactor, massFactor, dragFactor, thicknessFactor, gravFactor )
    {
        super(x, y);

        this.rope = new FloatRopes1(
            x, y, ropegroup, count,
            length, mass, drag, thickness, grav,
            lengthFactor, massFactor, dragFactor, thicknessFactor, gravFactor
        );


        this.children.push(this.rope);

        this.root = this.rope.bodies[0];
        this.hand = this.rope.bodies[this.rope.bodies.length-1];
    }


    update()
    {
        super.update();
        circle(this.world.x, this.world.y, 12);

        this.update_grab();

        this.rope.aggression = this.aggression;
        this.rope.update();
    }


    draw()
    {
        super.draw();
    }


    drawSegments( a: number, b: number)
    {
        const len   = this.rope.bodies.length-1;
        const start = Math.floor(a * len);
        const end   = Math.floor(b * len);
    
        this.rope.drawSegments(start, end);
    }



    private update_grab()
    {
        // if (this.grabbing == true)
        // {
        //     if (this.hand.pos.distSq(this.target) > 32*32)
        //     {
        //         this.grab_timer += deltaTime;
        //     }

        //     else
        //     {
        //         this.grab_timer = 0;
        //     }

        //     if (this.grab_timer > 1500)
        //     {
        //         this.grabbing = false;
        //     }

        //     const dir = vec2.tmp().displacement(this.hand.pos, this.target).mul(0.5);
        //     this.hand.addForce(dir);
        //     // this.hand.moveTo(this.target, 0.01);
        //     // this.hand.setPosition(this.target);
        // }

        // else
        // {
        //     this.grab_timer = 0;
        // }
    }


    reachFor( pos: vec2 ): boolean
    {
        const dir = vec2.copy(this.root.curr);
    
        // if (position.distSq(this.root.pos) > this.rope.tdist*this.rope.tdist)
        // {
        //     return;
        // }

        // this.target.copy(position);
        // this.grabbing = true;
        // return;

        // const world = __engine.getSystem(sys_World);
        // const dir   = vec2.tmp().normalizedDirection(this.hand.pos, position);

        // if (world.raycast(this.hand.x, this.hand.y, dir.x, dir.y))
        // {
        //     const res = HitInfo.res;

        //     if (this.hand.pos.dist(res) < this.rope.tdist)
        //     {
        //         this.target.copy(res);
        //         return true;
        //     }
        // }

        return false;
    }


    reach( dir: vec2 ): boolean
    {
        // const world = __engine.getSystem(sys_World);

        // if (world.raycast(this.root.x, this.root.y, dir.x, dir.y))
        // {
        //     const res = HitInfo.res;

        //     if (this.root.pos.dist(res) < this.rope.tdist && this.hand.lerp_pos.dist(res) > 32.0)
        //     {
        //         circle(res.x, res.y, 20);
        //         this.target.copy(res);
        //         return true;
        //     }
        // }

        return false;
    }


    isGrabbing(): boolean
    {
        return this.grabbing;
    }


}

