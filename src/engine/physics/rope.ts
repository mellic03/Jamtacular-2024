import { Engine } from "../engine.js";
import { iTransformable } from "../interface.js";
import vec2 from "../math/vec2.js";
import sys_Image from "../sys-image.js";
import { Render } from "../render.js";
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

    constructor( x: number, y: number, ropegroup: Group, count,
        length=32, mass=1.0, drag=0.1, friction=0.02, thickness=8, grav=0.02,
        lengthFactor=1, massFactor=1, dragFactor=1, frictionFactor=1, thicknessFactor=1, gravFactor=1 )
    {
        this.local = new Transform(0, 0, 0);
        this.world = new Transform(x, y, 0);

        this.bodies    = [];
        this.dist      = length;
        this.tdist     = count*length;
        this.thickness = thickness;

        for (let i=0; i<count; i++)
        {
            const B = new RigidBody(new Sprite(x+i*length/2, y), 0.5, "dynamic");

            B.sprite.radius       = (thickness/2);  thickness *= thicknessFactor;
            B.sprite.mass         = mass;           mass *= massFactor;
            B.sprite.drag         = drag;           drag *= dragFactor;
            B.sprite.gravityScale = grav;           grav *= gravFactor
            B.sprite.friction     = friction;       friction *= frictionFactor;
            B.sprite.bounciness   = 0.1;
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
            J.maxLength = length; length*=lengthFactor;
        }
    }


    update()
    {
        for (let B of this.bodies)
        {
            B.moveTowards(this.world.pos, 0.1);
            B.update();
        }
    }


    draw()
    {
        const imgsys = Engine.getSystem(sys_Image);
        const img = imgsys.get("assets/img/rope.png");
        imageMode(CORNER);

        for (let i=0; i<this.bodies.length-1; i++)
        {
            const A = vec2.copy(this.bodies[i+0].pos);
            const B = vec2.copy(this.bodies[i+1].pos);

            Render.imageRotated(
                img,
                0, -0.5*this.thickness, A.dist(B), this.thickness,
                A, B
            );
        }
    }
}
