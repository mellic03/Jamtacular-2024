import { Engine, __engine } from "../engine.js";
import vec2 from "../math/vec2.js";
import sys_Image from "../sys-image.js";
import sys_Physics from "../sys-physics.js";
import sys_Render from "../sys-render.js";
import sys_World from "../sys-world/sys-world.js";
import Transform from "../transform.js";
import { PHYS_TIMESTEP } from "./physics.js";
import BasedRigidBody from "./rigidbody-based.js";
import RigidBody from "./rigidbody.js";


export default class BasedRope
{
    transform: Transform;

    timer:     number;
    bodies:    Array<BasedRigidBody>;
    dist:      number;
    tdist:     number;
    thickness: number;

    constructor( parent: Transform, x: number, y: number,
                 count=8, length=32, mass=0.5, thickness=8 )
    {
        this.transform = new Transform(x, y, 0);
        this.transform.parent = parent;

        this.timer     = 0;
        this.bodies    = [];
        this.dist      = length;
        this.tdist     = count*length;
        this.thickness = thickness;

        for (let i=0; i<count; i++)
        {
            const B = new BasedRigidBody(x+i*length, y+16*Math.random(), mass);
            B.radius = 16;

            sys_Physics.GROUP_BASED_ROPES.addBody(B);

            if (i == 0)
            {
                B.fixed = true;
            }

            this.bodies.push(B);
        }
    }

    private _integrate()
    {
        for (let i=1; i<this.bodies.length; i++)
        {
            const A = this.bodies[i-1];
            const B = this.bodies[i];

            const disp  = vec2.tmp().displacement(A.curr, B.curr);
            const error = this.dist - disp.mag();
            const dir   = disp.normalize().mulXY(error);

            if (error > 0.0)
            {
                continue;
            }

            if (A.fixed == false && B.fixed == false)
            {
                A.curr.addMul(dir, -0.5);
                B.curr.addMul(dir, +0.5);
            }

            else if (A.fixed == true)
            {
                B.curr.addMul(dir, +1.0);
            }

            else if (B.fixed == true)
            {
                A.curr.addMul(dir, -1.0);
            }
        }
    }


    update()
    {
        this.transform.mult(this.transform.parent);
        this.bodies[0].setPosition(this.transform.x, this.transform.y);

        this.timer += __engine.dtime();

        while (this.timer >= PHYS_TIMESTEP)
        {
            for (let i=0; i<16; i++)
            {
                this._integrate();
            }

            this.timer -= PHYS_TIMESTEP;
        }

        this.bodies[0].setPosition(this.transform.x, this.transform.y);
    }


    draw()
    {
        const imgsys = __engine.getSystem(sys_Image);
        const img = imgsys.get("assets/img/rope.png");

        // fill(50);
        // stroke(150);

        imageMode(CORNER);

        for (let i=0; i<this.bodies.length-1; i+=1)
        {
            const A = vec2.copy(this.bodies[i+0].lerp_pos);
            const B = vec2.copy(this.bodies[i+1].lerp_pos);

            // circle(A.x, A.y, 2*this.bodies[0].radius);
            // circle(B.x, B.y, 2*this.bodies[0].radius);

            // line(A.x, A.y, B.x, B.y);

            sys_Render.imageRotated(
                img,
                0, -0.5*this.thickness, A.dist(B), this.thickness,
                A, B
            );
        }

        // const points_top = [];
        // const points_bot = [];

        // {
        //     const A   = vec2.copy(this.bodies[0].pos);
        //     const dir = vec2.tmp(0, +1).rotate(this.transform.parent.worldrot);
        //     const T   = vec2.tmp(-dir.y, dir.x);

        //     points_top.push(vec2.copy(A).addMul(T, -this.thickness/2));
        //     points_bot.push(vec2.copy(A).addMul(T, +this.thickness/2));
        // }
        
        // for (let i=0; i<this.bodies.length-1; i++)
        // {
        //     const A   = vec2.copy(this.bodies[i+0].pos);
        //     const B   = vec2.copy(this.bodies[i+1].pos);
        //     const dir = vec2.tmp().direction(A, B);
        //     const T   = vec2.tmp(-dir.y, dir.x);

        //     points_top.push(vec2.mix(A, B, 0.5).addMul(T, -this.thickness/2));
        //     points_bot.push(vec2.mix(A, B, 0.5).addMul(T, +this.thickness/2));
        // }


        // beginShape();

        // for (let i=0; i<points_top.length-1; i+=2)
        // {
        //     const A = points_top[i+0];
        //     const B = points_top[i+1];

        //     vertex(A.x, A.y);
        //     vertex(B.x, B.y);
        // }

        // for (let i=points_bot.length-1; i>=1; i-=2)
        // {
        //     const A = points_bot[i-0];
        //     const B = points_bot[i-1];

        //     vertex(A.x, A.y);
        //     vertex(B.x, B.y);
        // }

        // endShape();
    
        strokeWeight(1);
    }
}
