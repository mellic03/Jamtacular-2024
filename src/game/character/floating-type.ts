import { __engine } from "../../engine/engine.js";
import vec2 from "../../engine/math/vec2.js";
import BodyPartTentacle from "../bodypart/tentacle.js";
import { iCharacterController } from "../controller/controller.js";
import { RigidBodyCharacter } from "./character.js";



export class FloatRageTrigger
{
    private sprite: Sprite;

    constructor( x, y )
    {
        this.sprite = new Sprite(x, y, 64, 64);
        this.sprite.collider = "static";
        this.sprite.shape    = "box";
        // sys_Physics.GROUP_ANGRY.add(this.sprite);
    }

    draw()
    {
        rectMode(CENTER);
        fill(200, 50, 50);
        rect(this.sprite.x, this.sprite.y, 64, 64);
    }
}


export class FloatCalmTrigger
{
    private sprite: Sprite;

    constructor( x, y )
    {
        this.sprite = new Sprite(x, y, 64, 64);
        this.sprite.collider = "static";
        this.sprite.shape    = "box";
        // sys_Physics.GROUP_CALM.add(this.sprite);
    }

    draw()
    {
        rectMode(CENTER);
        fill(50, 200, 200);
        rect(this.sprite.x, this.sprite.y, 64, 64);
    }
}


export default class CharacterFloatingType extends RigidBodyCharacter
{
    // fire: BasedAnimation;

    tentacles  = new Array<BodyPartTentacle>()
    ray_dir    = new vec2(1, 0.001).normalize();
    grabbiness = 0;
    aggression = 1.0;

    constructor( x: number, y: number, ropegroup: Group, controller?: iCharacterController )
    {
        super(x, y, controller);

        // this.fire = BasedAnimation.loadTiled("assets/anim/particle/Flamethrower-Sheet.png", 3, 4, 10);
        // this.fire.size.setXY(128);
        // this.fire.duration = 0.35;

        // const wgroup = sys_Physics.GROUP_WORLD;
        // sys_Physics.GROUP_PLAYER.add(this.sprite);

        // this.sprite.collides(sys_Physics.GROUP_ANGRY, (A, B) => {
        //     this.aggression = 1.0;
        // });

        // this.sprite.collides(sys_Physics.GROUP_CALM, (A, B) => {
        //     this.aggression = 0.0;
        // });

        this.sprite.shape = "circle";
        this.sprite.mass  = 0.025;
        this.sprite.gravityScale = 0;
        this.sprite.autoDraw = false;
        this.drag = 0.5;
        this.sprite.overlaps(ropegroup);

        const dir   = vec2.tmp().setXY(0, 1);
        const count = 8;

        for (let i=0; i<count; i++)
        {
            const T = new BodyPartTentacle(16*dir.x, 16*dir.y, ropegroup, 8, random(32, 45), 0.25, 16);
            T.hand.sprite.mass = 16;

            this.tentacles.push(T);
            this.addPart(T);

            dir.rotate(2*Math.PI / count);
        }
    

        // this.tentacles[this.tentacles.length-1].hand.sprite.collider = "dynamic";
        // this.tentacles[this.tentacles.length-1].hand.sprite.radius *= 2;
        // wgroup.add(this.tentacles[this.tentacles.length-1].hand.sprite);
    }


    update()
    {
        super.update();

        for (let T of this.tentacles)
        {
            T.aggression = this.aggression;
        }
    }



    private draw_face()
    {
        const dir = vec2.tmp().setXY(0, 1);

        fill(50);
        stroke(100);
        for (let i=0; i<this.tentacles.length; i++)
        {
            dir.rotate(2*Math.PI / this.tentacles.length);
            circle(this.world.x+16*dir.x, this.world.y+16*dir.y, 16);
        }

        const a1 = this.aggression * (0.5 + 0.0015*this.vel.magSq());
        const a2 = 1.0 - a1;
        fill(50 + 255*a1, 50+100*a2, 50+100*a2);
        circle(this.world.x, this.world.y, 16);

    }


    draw()
    {
        super.draw();

        for (let T of this.tentacles)
        {
            T.drawSegments(0, 0.25);
        }

        this.draw_face();

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
        const scale = 4;

        for (let T of this.tentacles)
        {
            for (let B of T.rope.bodies)
            {
                T.hand.applyForceXY(3*x*alpha, 3*y*alpha);
            }
        }

        super.move(scale*x * (1.0 + alpha), scale*y * (1.0 + alpha));
    }


    moveTo( x: number, y: number ): void
    {
        const dt   = deltaTime;
        const disp = vec2.tmp().displacement(this.world.pos, vec2.tmp(x, y));

        if (disp.magSq() > 0.0005)
        {
            const dir = disp.normalize();
            this.move(dir.x, dir.y);
        }
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

