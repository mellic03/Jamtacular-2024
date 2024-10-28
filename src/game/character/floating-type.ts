import { Engine, __engine } from "../../engine/engine.js";
import { IO, KEYCODE } from "../../engine/IO.js";
import vec2 from "../../engine/math/vec2.js";
import { RigidBodyDistanceConstraint } from "../../engine/physics/rigidbody.js";
import sys_Physics from "../../engine/sys-physics.js";
import sys_Render from "../../engine/sys-render.js";
import sys_World, { HitInfo } from "../../engine/sys-world.js";
import BodyPartTentacle from "../bodypart/tentacle.js";
import { RigidBodyCharacter } from "./character.js";
import CharacterController from "./controller.js";


export default class CharacterFloatingType extends RigidBodyCharacter
{
    tentacles  = new Array<BodyPartTentacle>();
    ray_dir    = new vec2(1, 0.001).normalize();
    grabbiness = 0;

    constructor( x: number, y: number, controller: CharacterController )
    {
        super(x, y, controller);

        const physys = __engine.getSystem(sys_Physics);
        const group  = physys.getGroup("world");

        group.addBody(this);

        this.tentacles = [
            new BodyPartTentacle(group, -16,   0, 6, 64),
            new BodyPartTentacle(group,  -8,  -8, 6, 64),
            new BodyPartTentacle(group,  -8,  +8, 6, 64),
            new BodyPartTentacle(group,   0, -16, 6, 64),
            new BodyPartTentacle(group,   0, +16, 6, 64),
            new BodyPartTentacle(group,  +8,  -8, 6, 64),
            new BodyPartTentacle(group,  +8,  +8, 6, 64),
            new BodyPartTentacle(group, +16,   0, 6, 64)
        ]

        for (let T of this.tentacles)
        {
            this.addPart(T);
        }
    }


    update( engine: Engine )
    {
        super.update(engine);
        this.grabbiness = 0;

        const world = engine.getSystem(sys_World);

        for (let i=0; i<this.tentacles.length; i++)
        {
            const T = this.tentacles[i];
            this.ray_dir.rotate(0.1 * 1.618).normalize();

            if (T.isGrabbing())
            {
                this.grabbiness += 1;
            }
        
            else
            {
                // fill(50, 255, 50);

                // if (world.raycast(this.pos.x, this.pos.y, this.ray_dir.x, this.ray_dir.y))
                // {
                //     circle(HitInfo.res.x, HitInfo.res.y, 20);
                //     T.reachFor(HitInfo.res);
                // }
            }
        }

        if (IO.keyDown(KEYCODE.Q))
        {
            this.transform.localrot -= 0.05;
        }

        if (IO.keyDown(KEYCODE.E))
        {
            this.transform.localrot += 0.05;
        }

        if (IO.mouseClicked())
        {
            const ren    = engine.getSystem(sys_Render);
            const screen = vec2.tmpA.setXY(mouseX, mouseY);
            const world  = vec2.tmpB;
            ren.screenToWorld(screen, world);

            for (let T of this.tentacles)
            {
                T.reachFor(world);
            }
        }
    }


    draw( engine: Engine )
    {
        super.draw(engine);
        const dir = vec2.temp.copy(this.vel).normalize();

        for (let T of this.tentacles)
        {
            T.draw(engine);
        }

        fill(200);
        circle(this.lerp_pos.x, this.lerp_pos.y, 32);
    }


    move( x: number, y: number ): void
    {
        for (let T of this.tentacles)
        {
            T.hand.addForceXY(32*x, 32*y);
        }

        this.addForceXY(32*x, 32*y);
    }

}

