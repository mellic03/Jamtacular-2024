import { Engine, __engine } from "../engine.js";
import vec2 from "../math/vec2.js";
import sys_Image from "../sys-image.js";
import sys_Render from "../sys-render.js";
import CollisionGroup from "./group.js";
import RigidBody, { RigidBodyDistanceConstraint } from "./rigidbody.js";


export default class Rope
{
    pos:    vec2;
    group:  CollisionGroup;
    bodies: Array<RigidBody>;
    tdist:  number;
    thickness: number;

    constructor( group: CollisionGroup, x: number, y: number,
                 count=8, length=32, thickness=8, mass=1.0, elasticity=0.0 )
    {
        this.pos       = new vec2(x, y);
        this.group     = group;
        this.bodies    = [];
        this.tdist     = count*length;
        this.thickness = thickness;


        this.bodies.push(new RigidBody(x, y, mass, true));

        for (let i=1; i<count; i++)
        {
            this.bodies.push(new RigidBody(x+length*i, y, mass, false));
    
            const A = this.bodies[i-1];
            const B = this.bodies[i];

            A.addConstraint(new RigidBodyDistanceConstraint(length), B);
        }

        for (let body of this.bodies)
        {
            group.addBody(body);
        }
    }


    draw( engine: Engine )
    {
        const imgsys = engine.getSystem(sys_Image);
        const img = imgsys.get("assets/img/rope.png");

        for (let i=0; i<this.bodies.length-1; i++)
        {
            const A = this.bodies[i+0].lerp_pos;
            const B = this.bodies[i+1].lerp_pos;

            sys_Render.imageRotated(
                img, 0, -0.5*this.thickness, A.dist(B), this.thickness, A, B
            );

        }
    }
}
