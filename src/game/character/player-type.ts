import { __engine } from "../../engine/engine.js";
import { math } from "../../engine/math/math.js";
import sys_Physics from "../../engine/sys-physics.js";
import { HierarchicalTransform, Transform2 } from "../../engine/transform.js";
import LegTwoJoint from "../bodypart/leg-twojoint.js";
import { RigidBodyCharacter } from "./character.js";
import { iCharacterController } from "./controller.js";


export default class CharacterPlayerType extends RigidBodyCharacter
{
    // private _acc = new vec2(0, 0);
    // private _vel = new vec2(0, 0);

    legs = new Array<LegTwoJoint>();

    constructor( x: number, y: number, controller?: iCharacterController )
    {
        super(x, y, controller);

        this.sprite.width      = 64;
        this.sprite.height     = 200;
        this.sprite.friction   = 0.1;
        this.sprite.drag       = 0.1;
        this.sprite.bounciness = 0.0;
        this.sprite.radius     = 64.0;
        this.sprite.autoDraw   = false;

        this.sprite.gravityScale = 1.0;
        this.sprite.rotationLock = true;
        this.sprite.shape = "circle";
        // this.sprite.collider = "kinematic";

        this.legs = [
            new LegTwoJoint(-32, -42, [55, 66], 0.05),
            new LegTwoJoint(+32, -42, [55, 66], 0.2),
        ];

        this.legs[0].other = this.legs[1];
        this.legs[1].other = this.legs[0];

        for (let L of this.legs)
        {
            this.children.push(L);
            this.addPart(L);
        }

        sys_Physics.GROUP_PLAYER.add(this.sprite);

    }


    update()
    {
        super.update();
        const dt = (deltaTime / 1000.0);

    }


    draw()
    {
        noFill();
        stroke(50, 50, 255);
        circle(this.x, this.y, 2*this.radius);

        this.legs[0].draw();
        this.legs[1].draw();

        // this.sprite.draw();
    }


    move( x: number, y: number ): void
    {
        const dt = (deltaTime / 1000.0);

        this.sprite.vel.x += 8.0 * dt * Math.sign(x);
        this.sprite.vel.x = math.clamp(this.sprite.vel.x, -8, +8);
        this.sprite.vel.y += 0.5*y;
    
    }


    interact( x: number, y: number, msg?: string ): void
    {

    }

}

