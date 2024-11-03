import {} from "p5/global";
import { Engine }
 from "../../engine/engine.js";
import { HierarchicalTransform, Transform } from "../../engine/transform.js";
import BodyPart from "../bodypart/bodypart.js";
import RigidBody from "../../engine/physics/rigidbody.js";
import vec2 from "../../engine/math/vec2.js";
import { iTransformable } from "../../engine/interface.js";
import { iCharacterController, iControllable } from "../controller/controller.js"
import { Game } from "../game.js";




class CharacterConfigJSON
{
    behaviour: BehaviourConfigJSON;
    body:      BodyConfigJSON;

    constructor( C: RigidBodyCharacter, json: object )
    {
        console.log(json);

        console.assert(json.hasOwnProperty("behaviour"), `[${C.typename}] No behaviour`);
        console.assert(json.hasOwnProperty("body"),      `[${C.typename}] No body`);
        console.assert(json.hasOwnProperty("limbs"),     `[${C.typename}] No limbs`);
    
        this.behaviour = new BehaviourConfigJSON(json["behaviour"]);
        this.body      = new BodyConfigJSON(json["body"]);
    }
}


class BehaviourConfigJSON
{
    moveForce: number = 1;
    jumpForce: number = 1;

    constructor( config: object )
    {
        this.moveForce = config["moveForce"];
        this.jumpForce = config["jumpForce"];
    }
}


class BodyConfigJSON
{
    mass:     number = 1.0;
    drag:     number = 0.5;
    friction: number = 0.5;
    grav:     number = 1.0;

    constructor( config: object )
    {
        this.mass     = config["mass"];
        this.drag     = config["drag"];
        this.friction = config["friction"];
        this.grav     = config["grav"];
    }
}






export class RigidBodyCharacter extends RigidBody implements iControllable, iTransformable
{
    // protected _name: string;
    public    typename: string;

    config:   CharacterConfigJSON;

    local:    Transform;
    world:    Transform;
    children: Array<iTransformable>;

    aggression: number = 0;

    private controllers = new Array<iCharacterController>();
    public  parts       = new Array<BodyPart>;

    constructor( x: number, y: number, controller?: iCharacterController )
    {
        super(new Sprite(x, y), 1);

        this.typename = this.constructor.name;
        this.local    = new Transform(x, y, 0);
        this.world    = new Transform(0, 0, 0);
        this.children = new Array<iTransformable>();

        this.sprite["AyyLmao"] = this;

        {
            const json = Game.CharacterConfig;
            console.assert(json.hasOwnProperty(this.typename), "Ruh roh");

            this.config = new CharacterConfigJSON(this, json[this.typename]);
        }


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


    update()
    {
        this.local.pos.setXY(this.sprite.x, this.sprite.y);
        HierarchicalTransform(this, Transform.Identity);
    
        if (this.getController() != null)
        {
            this.getController().update(this);
        }

    }


    rotate( theta: number ): void
    {
        this.local.rot += theta;
    }


    move( x: number, y: number ): void
    {
        const dir   = vec2.tmp(x, y);
        const speed = this.config.behaviour.moveForce;

        if (Math.abs(dir.x) == 0 && Math.abs(dir.y) == 0)
        {
            return;
        }

        const scale = deltaTime / 16;
        dir.normalize().mulXY(speed);

        this.applyForceXY(dir.x, dir.y);
    }


    moveTo( x: number, y: number ): void
    {
        const dt   = 16.0; // deltaTime;
        const disp = vec2.tmp().displacement(this.world.pos, vec2.tmp(x, y));

        if (disp.magSq() > 0.0005)
        {
            const dir = disp.normalize();
            this.applyForce(dir.mulXY(dt));
        }
    }


    jump(): void
    {
        this.applyForceXY(0, -1.0);
    }


    interact( x: number, y: number, msg: string = "" ): void
    {

    }
    
}

