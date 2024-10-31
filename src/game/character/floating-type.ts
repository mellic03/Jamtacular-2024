import BasedAnimation from "../../engine/animation.js";
import { __engine } from "../../engine/engine.js";
import vec2 from "../../engine/math/vec2.js";
import Rope from "../../engine/physics/rope.js";
import sys_Physics from "../../engine/sys-physics.js";
import ProjectileManager from "../../engine/sys-projectile.js";
import BodyPartTentacle from "../bodypart/tentacle.js";
import { RigidBodyCharacter } from "./character.js";
import { iCharacterController } from "./controller.js";




export default class CharacterFloatingType extends RigidBodyCharacter
{
    // fire: BasedAnimation;

    tentacles  = new Array<BodyPartTentacle>()
    ray_dir    = new vec2(1, 0.001).normalize();
    grabbiness = 0;
    aggression = 0.0;

    constructor( x: number, y: number, controller?: iCharacterController )
    {
        super(x, y, controller);

        // this.fire = BasedAnimation.loadTiled("assets/anim/particle/Flamethrower-Sheet.png", 3, 4, 10);
        // this.fire.size.setXY(128);
        // this.fire.duration = 0.35;

        const worldgroup = sys_Physics.GROUP_WORLD;
        sys_Physics.GROUP_PLAYER.add(this.sprite);


        const S0 = new Sprite(+400, +300, 32, 32);
        const S1 = new Sprite(+300, +300, 32, 32);

        S0.shape = "circle";
        S0.collider = "static";
        S1.collider = "static";

        sys_Physics.GROUP_ANGRY.add(S0);
        sys_Physics.GROUP_CALM.add(S1);

        this.sprite.collides(sys_Physics.GROUP_ANGRY, (A, B) => {
            this.aggression = 1.0;
        });

        this.sprite.collides(sys_Physics.GROUP_CALM, (A, B) => {
            this.aggression = 0.0;
        });

        this.sprite.shape = "circle";
        this.sprite.mass  = 1;
        this.sprite.gravityScale = 0;
        this.sprite.autoDraw = false;
        this.drag = 0.99;
        worldgroup.add(this.sprite);

        const dir   = vec2.tmp().setXY(0, 1);
        const count = 8;

        for (let i=0; i<count; i++)
        {
            const T = new BodyPartTentacle(16*dir.x, 16*dir.y, 12, random(28, 42), 0.25, 16);

            this.tentacles.push(T);
            this.addPart(T);

            dir.rotate(2*Math.PI / count);
        }
    }


    update()
    {
        super.update();

        for (let T of this.tentacles)
        {
            T.aggression = this.aggression;
        }
    }


    draw()
    {
        super.draw();
    
        for (let T of this.tentacles)
        {
            T.drawSegments(0, 0.25);
        }

        const dir = vec2.tmp().setXY(0, 1);

        fill(50);
        stroke(100);
        for (let i=0; i<this.tentacles.length; i++)
        {
            dir.rotate(2*Math.PI / this.tentacles.length);
            circle(this.world.x+16*dir.x, this.world.y+16*dir.y, 16);
        }

        const a1 = this.aggression * 0.003*this.vel.magSq();
        fill(50 + 255*a1, 50, 50);
        circle(this.world.x, this.world.y, 16);


        for (let T of this.tentacles)
        {
            T.drawSegments(0.25, 1.0);
        }

    }


    move( x: number, y: number ): void
    {
        x = Math.sign(x);
        y = Math.sign(y);

        const alpha = this.aggression;

        for (let T of this.tentacles)
        {
            for (let B of T.rope.bodies)
            {
                T.hand.applyForceXY(3*alpha*x, 3*alpha*y);
            }
        }

        super.move(8*x * (1.0 + alpha), 8*y * (1.0 + alpha));
    }


    interact( x: number, y: number, msg?: string ): void
    {
        // this.fire.playing = true;
        // this.fire.looping = true;

        // const vel = vec2.tmp(x, y).sub(this.pos).normalize().mulXY(2*4096);
        
        // ProjectileManager.createProjectile(
        //     this.x, this.y, vel.x, vel.y, this.fire, ( hit: vec2, vel: vec2 ) => {
        //         // this.anims[this.anim_idx].playing  = true;
        //         // this.anims[this.anim_idx].looping  = false;
        //         // this.anims[this.anim_idx].duration = 0.5;
        
        //         // this.anims[this.anim_idx].pos.copy(hit);
            
        //         // this.anim_idx = (this.anim_idx + 1) % 32;
        //     }
        // );
    }

}

