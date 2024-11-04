import { Engine } from "../../engine/engine.js";
import vec2 from "../../engine/math/vec2.js";
import { Tentacle, TentacleConfigJSON, TentacleEvent } from "../bodypart/Tentacle2.js";
import { CharacterController } from "../controller/controller.js";
import { Game } from "../game.js";
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
    tentacles  = new Array<Tentacle>()
    ray_dir    = new vec2(1, 0.001).normalize();
    grabbiness = 0;

    constructor( x: number, y: number, ropegroup: Group, controller?: CharacterController )
    {
        super(x, y, controller);

        let config = Game.CharacterConfig[this.typename];
        let tconfig: TentacleConfigJSON;

        for (let limbName in config["limbs"])
        {
            const limbCount = config["limbs"][limbName];
            tconfig = new TentacleConfigJSON(limbName, limbCount);
        }

        for (let i=0; i<tconfig.count; i++)
        {
            const dir = vec2.tmp(0, 1).rotate(2*i*Math.PI / tconfig.count);
            this.tentacles.push(new Tentacle(0+16*dir.x, 0+16*dir.y, this.sprite, tconfig, ropegroup));
            tconfig.memberCount += 1;
        }

        this.sprite.mass         = this.config.body.mass;
        this.sprite.drag         = this.config.body.drag;
        this.sprite.friction     = this.config.body.friction;
        this.sprite.gravityScale = this.config.body.grav;

        this.sprite.overlaps(ropegroup);


        for (let T of this.tentacles)
        {
            T.on(TentacleEvent.HIT_GROUND, () => {
                // const audiosys = Engine.getSystem(sys_Audio);
                // const audio = audiosys.get("assets/audio/click.wav");
                // audio.play(0);
            });
        }
    }


    update()
    {
        super.update();

        for (let T of this.tentacles)
        {
            T.world.copy(T.local).mult(this.local);
            T.update(this.aggression);
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
            T.draw(0, 0.25);
        }

        this.draw_face();

        for (let T of this.tentacles)
        {
            T.draw(0.25, 1.0);
        }
    }


    move( x: number, y: number ): void
    {
        for (let T of this.tentacles)
        {
            T.move(x, y);
        }

        super.move(x, y);
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

    }

}

