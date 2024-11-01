import { __engine } from "../../engine/engine.js";
import { math } from "../../engine/math/math.js";
import BodyPartLeg2 from "../bodypart/leg2.js";
import { iCharacterController } from "../controller/controller.js";
import { RigidBodyCharacter } from "./Character.js";


export default class CharacterBiped extends RigidBodyCharacter
{
    private dick_height = 160;
    private dick_offset = 32;
    private crouching   = false;

    legs = new Array<BodyPartLeg2>();

    constructor( x: number, y: number, group: Group, controller?: iCharacterController )
    {
        super(x, y, controller);

        this.sprite.width      = 64;
        this.sprite.height     = 64;
        this.sprite.friction   = 1.0;
        this.sprite.drag       = 1.0;
        this.sprite.bounciness = 0.0;
        // this.sprite.radius     = 32.0;
        this.sprite.mass       = 1.0;
        this.sprite.autoDraw   = false;

        this.sprite.gravityScale = 1.0;
        this.sprite.rotationLock = true;
        this.sprite.shape = "box";

        this.legs = [
            new BodyPartLeg2(-32, +32, [100, 100, 100, 100], 0.05),
            new BodyPartLeg2(+32, +32, [100, 100, 100, 100], 0.2),
        ];

        // this.legs[0].other = this.legs[1];
        // this.legs[1].other = this.legs[0];

        for (let L of this.legs)
        {
            this.children.push(L);
            this.addPart(L);
        }

        group.add(this.sprite);
        // sys_Physics.GROUP_PLAYER.add(this.sprite);

    }


    update()
    {
        super.update();

        const L = this.legs[0];
        const R = this.legs[1];

        // const y  = Math.max(L.foot.y, R.foot.y);
        const y  = 0.5 * (L.foot.y + R.foot.y);
        const dy = (this.crouching) ? (y - (this.dick_height - this.dick_offset)) : (y - this.dick_height);

        let count = 0;

        this.sprite.gravityScale = 0;

        if (L.isGrounded() == false) this.sprite.gravityScale += 0.5;
        if (R.isGrounded() == false) this.sprite.gravityScale += 0.5;

        if (this.world.y > dy)
        {
            let overlap = this.world.y - dy;
            this.sprite.vel.y -= 0.05*overlap;

            // this.sprite.y -= overlap;
        }
    }


    draw()
    {
        noFill();
        stroke(50, 50, 255);
        // circle(this.x, this.y, 2*this.radius);
        this.sprite.draw();

        this.legs[0].draw();
        this.legs[1].draw();
    }


    move( x: number, y: number ): void
    {
        const dt = (deltaTime / 1000.0);

        this.sprite.vel.x += 32.0 * dt * Math.sign(x);
        this.sprite.vel.x = math.clamp(this.sprite.vel.x, -8, +8);

        this.sprite.vel.y += 32.0 * dt * Math.sign(y);
        this.sprite.vel.y = math.clamp(this.sprite.vel.y, -8, +8);
    
    }


    interact( x: number, y: number, msg?: string ): void
    {

    }

}

