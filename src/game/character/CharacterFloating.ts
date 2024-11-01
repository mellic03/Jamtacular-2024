import { __engine } from "../../engine/engine.js";
import { math } from "../../engine/math/math.js";
import vec2 from "../../engine/math/vec2.js";
import BodyPartTentacle from "../bodypart/tentacle.js";
import { iCharacterController } from "../controller/controller.js";
import { Game } from "../game.js";
import { GS_Gameplay } from "../state/gameplay/gameplay.js";
import { RigidBodyCharacter } from "./Character.js";



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


export default class CharacterFloating extends RigidBodyCharacter
{
    // fire: BasedAnimation;
    speed      = [0, 0, 0, 0];

    tentacles  = new Array<BodyPartTentacle>()
    ray_dir    = new vec2(1, 0.001).normalize();
    grabbiness = 0;
    aggression = 1.0;

    constructor( x: number, y: number, ropegroup: Group, controller?: iCharacterController )
    {
        super(x, y, controller);

        const cname = this.constructor.name;

        this.speed          = Game.config[cname]["speed"];
        this.aggression     = Game.config[cname]["aggression"];

        this.drag           = Game.config[cname]["drag"];
        this.sprite.mass    = Game.config[cname]["mass"];
        this.sprite.shape   = "circle";
        this.sprite.gravityScale = 0;
        this.sprite.autoDraw = false;
        this.sprite.overlaps(ropegroup);

        
        const dir      = vec2.tmp().setXY(0, 1);
        const data     = Game.config[cname]["tentacles"]["factors"];
        const count    = Game.config[cname]["tentacles"]["count"];
        const segCount = data["count"];
        const segLen   = data["length"];
        const segMass  = data["mass"];
        const segDrag  = data["drag"];
        const segWidth = data["width"];
        const segGrav  = data["grav"];

        console.log(this)
        for (let i=0; i<count; i++)
        {
            const segments = segCount[0] + random(-segCount[2], +segCount[2]);
            const sLength  = segLen[0]   + random(-segLen[2],   +segLen[2]);
            const sMass    = segMass[0]  + random(-segMass[2],  +segMass[2]);
            const sDrag    = segDrag[0]  + random(-segDrag[2],  +segDrag[2]);
            const sWidth   = segWidth[0] + random(-segWidth[2], +segWidth[2]);
            const sGrav    = segGrav[0]  + random(-segGrav[2],  +segGrav[2]);

            const T = new BodyPartTentacle(
                16*dir.x, 16*dir.y, ropegroup, segments,
                  sLength,      sMass,      sDrag,     sWidth,  sGrav,
                segLen[1], segMass[1], segDrag[1], segWidth[1], segGrav[1]
            );

            // T.hand.sprite.mass = math.mix(rtMass[0], rtMass[1], i/count);

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
            for (let i=0; i<T.rope.bodies.length; i++)
            {
                T.hand.applyForceXY(3*x*alpha, 3*y*alpha);
            }
        }

        super.move(scale*x * (1.0 + alpha), scale*y * (1.0 + alpha));
    }


    moveTo( x: number, y: number ): void
    {
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

