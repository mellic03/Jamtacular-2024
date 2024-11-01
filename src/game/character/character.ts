import {} from "p5/global";
import { __engine } from "../../engine/engine.js";
import { HierarchicalTransform, Transform } from "../../engine/transform.js";
import BodyPart from "../bodypart/bodypart.js";
import RigidBody from "../../engine/physics/rigidbody.js";
import vec2 from "../../engine/math/vec2.js";
import { iTransformable } from "../../engine/interface.js";
import { iCharacterController, iControllable } from "../controller/controller.js"





export class CharacterConfig
{
    speed1 = 1.0;
    speed2 = 1.75;

    jump_duration = 1.0;

}




export class RigidBodyCharacter extends RigidBody implements iControllable, iTransformable
{
    local:    Transform;
    world:    Transform;
    children: Array<iTransformable>;
    config:   CharacterConfig;

    private timer = 0.0;
    private try_jump = false;
    private jump_timer = 0.0;

    private controllers = new Array<iCharacterController>();
    public  parts       = new Array<BodyPart>;
    public  state       = "idle";

    constructor( x: number, y: number, controller?: iCharacterController )
    {
        super(new Sprite(x, y), 1);

        this.local    = new Transform(x, y, 0);
        this.world    = new Transform(0, 0, 0);
        this.children = new Array<iTransformable>();
        this.config   = new CharacterConfig();

        this.pushController(controller);
    }


    pushController( ctl: iCharacterController )
    {
        if (ctl != null)
        {
            this.controllers.push(ctl);
        }
    }

    popController(): iCharacterController | null
    {
        if (this.controllers.length > 0)
        {
            return this.controllers.pop();
        }

        else
        {
            return null;
        }
    }

    getController(): iCharacterController | null
    {
        if (this.controllers.length > 0)
        {
            return this.controllers[this.controllers.length-1];
        }

        return null;
    }


    addPart( part: BodyPart )
    {
        this.children.push(part);
        this.parts.push(part);
    }


    private _jumping()
    {
        const dt = deltaTime / 1000.0;

        this.jump_timer += (deltaTime / 1000.0);

        if (this.jump_timer < 0.25)
        {
            this.sprite.vel.y = -4.0;
        }
    
        else
        {
            this.state = "idle";
            this.jump_timer = -1.0;
        }
    }


    update()
    {
        this.local.pos.setXY(this.sprite.x, this.sprite.y);
        HierarchicalTransform(this, Transform.Identity);

        if (this.getController() != null)
        {
            this.getController().update(this);
        }

        if (this.state == "idle")
        {
            this.jump_timer += __engine.dtime();

            if (this.try_jump)
            {
                this.state = "jumping";
                this.try_jump = false;
            }
        }

        else if (this.state == "jumping")
        {
            this._jumping();
        }

        for (let part of this.parts)
        {
            part.update();
        }
    }


    rotate( theta: number ): void
    {
        this.local.rot += theta;
    }

    move( x: number, y: number ): void
    {
        const dir   = vec2.tmp(x, y);
        const magSq = dir.magSq();

        if (Math.abs(dir.x) == 0 && Math.abs(dir.y) == 0)
        {
            return;
        }

        dir.divXY(Math.sqrt(magSq));

        this.applyForceXY(dir.x, dir.y);
    }

    moveTo( x: number, y: number ): void
    {
        const dt   = deltaTime;
        const disp = vec2.tmp().displacement(this.world.pos, vec2.tmp(x, y));

        if (disp.magSq() > 0.0005)
        {
            const dir = disp.normalize();
            this.applyForce(dir.mulXY(0.01*dt));
        }
    }

    jump(): void
    {
        if (this.state != "jumping" && this.jump_timer > 0.0)
        {
            this.try_jump = true;
            this.jump_timer = 0.0;
        }
        // this.applyForceXY(0, -32.0);
    }

    interact( x: number, y: number, msg: string = "" ): void
    {

    }
    
}

