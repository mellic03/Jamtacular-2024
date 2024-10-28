import Actor, { Controllable } from "../../engine/actor.js";
import { Engine, __engine } from "../../engine/engine.js";
import { IO, KEYCODE } from "../../engine/IO.js";
import RigidBody from "../../engine/physics/rigidbody.js";
import sys_Event from "../../engine/sys-event.js";
import sys_Image from "../../engine/sys-image.js";
import Transform from "../../engine/transform.js";
import BodyPartArm from "../bodypart/arm.js";
import BodyPart from "../bodypart/bodypart.js";
import BodyPartHead from "../bodypart/head.js";
import LegController from "../bodypart/leg-controller.js";
import BodyPartLeg from "../bodypart/leg.js";
import CharacterController from "./controller.js";


export default class Character extends Actor
{
    public controller: CharacterController | null;

    public parts  = new Array<BodyPart>
    public head   = new Array<BodyPartHead>;
    public arms   = new Array<BodyPartArm>;
    public legctl = new Array<LegController>;


    constructor( x: number, y: number, controller: CharacterController | null = null )
    {
        super(x, y, 0);
        this.controller = controller;
    }

    addPart( part: BodyPart )
    {
        part.parent = this;
        this.parts.push(part);
    }

    addHead( head: BodyPartHead )
    {
        this.head.push(head);
        this.addPart(head);
    }

    addArm( arm: BodyPartArm )
    {
        this.arms.push(arm);
        this.addPart(arm);
    }


    addLegController( controller: LegController )
    {
        this.legctl.push(controller);
    }


    setLimbDirection( dir: number )
    {
        for (let arm of this.arms)
        {
            arm.direction = Math.sign(dir);
        }
    }

    update( engine: Engine )
    {
        super.update(engine);

        if (this.controller != null)
        {
            this.controller.update(engine, this);
        }

        for (let part of this.parts)
        {
            part.transform.mult(this.transform);
            part.update(engine);
        }
    }

    draw( engine: Engine )
    {

    }

}



export class RigidBodyCharacter extends RigidBody implements Controllable
{
    public transform: Transform;
    public controller: CharacterController | null;
    public parts  = new Array<BodyPart>

    constructor( x: number, y: number, controller: CharacterController | null = null )
    {
        super(x, y, 0);
        this.transform  = new Transform(0, 0, 0);
        this.controller = controller;
    }


    addPart( part: BodyPart )
    {
        this.parts.push(part);
    }


    update( engine: Engine )
    {
        this.controller.update(engine, this);

        this.transform.localpos.copy(this.lerp_pos);
        this.transform.mult(Transform.I);

        for (let part of this.parts)
        {
            part.transform.ForwardKinematics(this.transform);
            part.update(engine);
        }
    }


    move( x: number, y: number ): void
    {
        this.addForceXY(32*x, 32*y);
    }

}

