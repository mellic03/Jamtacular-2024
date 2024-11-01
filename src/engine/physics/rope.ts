import { __engine } from "../engine.js";
import { iTransformable } from "../interface.js";
import vec2 from "../math/vec2.js";
import sys_Image from "../sys-image.js";
import sys_Render from "../sys-render.js";
import { Transform } from "../transform.js";
import RigidBody from "./rigidbody.js";


export default class Rope implements iTransformable
{
    local: Transform;
    world: Transform;
    children = new Array<iTransformable>();

    bodies:    Array<RigidBody>;
    dist:      number;
    tdist:     number;
    thickness: number;

    constructor( x: number, y: number, ropegroup: Group, count=8, length=32, mass=1.0, thickness=8 )
    {
        this.local = new Transform(0, 0, 0);
        this.world = new Transform(x, y, 0);

        this.bodies    = [];
        this.dist      = length;
        this.tdist     = count*length;
        this.thickness = thickness;

        for (let i=0; i<count; i++)
        {
            const B = new RigidBody(new Sprite(x+i*length/2, y), mass, "dynamic");

            B.sprite.radius       = thickness/2;
            B.sprite.drag         = 0.7;
            B.sprite.friction     = 0.25;
            B.sprite.gravityScale = 0.01;
            B.sprite.bounciness   = 0.0;
            B.sprite.autoDraw     = false;

            B.sprite.x = x + i*length;
            B.curr.x   = x + i*length;
            B.prev.x   = x + i*length;

            ropegroup.add(B.sprite);
            this.bodies.push(B);
        }

        for (let i=0; i<count-1; i++)
        {
            const A = this.bodies[i].sprite;
            const B = this.bodies[i+1].sprite;

            const J = new RopeJoint(A, B);
            J.maxLength = length;
        }
    }


    update()
    {
        // this.transform.mult(this.transform.parent);
    
        circle(this.world.x, this.world.y, 25);
        this.bodies[0].moveTowards(this.world.pos, 1.0);

        for (let B of this.bodies)
        {
            B.update();
        }
    }


    draw()
    {
        const imgsys = __engine.getSystem(sys_Image);
        const img = imgsys.get("assets/img/rope.png");
        imageMode(CORNER);

        for (let i=0; i<this.bodies.length-1; i++)
        {
            const A = vec2.copy(this.bodies[i+0].pos);
            const B = vec2.copy(this.bodies[i+1].pos);

            sys_Render.imageRotated(
                img,
                0, -0.5*this.thickness, A.dist(B), this.thickness,
                A, B
            );
        }
    }
}
