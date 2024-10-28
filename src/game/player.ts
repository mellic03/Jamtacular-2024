import Character from "./character/character.js";
import { Engine, __engine } from "../engine/engine.js";
import { IO, KEYCODE } from "../engine/IO.js";
import vec2 from "../engine/math/vec2.js";
import sys_Event, { EventEmitter, EventEmitting } from "../engine/sys-event.js";
import BodyPartHead from "./bodypart/head.js";
import sys_Render from "../engine/sys-render.js";
import { math } from "../engine/math/math.js";
import BodyPartArm from "./bodypart/arm.js";
import LegControllerBiped from "./bodypart/leg-controller-biped.js";
import sys_World, { HitInfo } from "../engine/sys-world.js";
import sys_Image from "../engine/sys-image.js";
import { Image } from "p5";
import Rope from "../engine/physics/rope.js";
import sys_Physics from "../engine/sys-physics.js";


export default class Player extends Character implements EventEmitting<number>
{
    event = new EventEmitter<number>();
    legcontroller: LegControllerBiped;

    rope: Rope;

    hi_height = 0.999;
    lo_height = 0.4;

    heightfactor: number = 0;
    yoffset: number = 0;
    roffset: number = 0;

    img_body: Image;

    constructor( x: number, y: number, engine: Engine )
    {
        super(x, y);

        const ren = engine.getSystem(sys_Render);
        ren.view.setXY(x, y);

        const physys = engine.getSystem(sys_Physics);
        const group  = physys.getGroup("default");
        this.rope = new Rope(group, x, y, 8, 64, 8, -1);


        const img = engine.getSystem(sys_Image);
        this.img_body = img.get("assets/img/heart-red.png");

        this.addHead(new BodyPartHead(0, -48, img.get("assets/img/michael.png")));

        this.legcontroller = new LegControllerBiped(this);
        this.addLegController(this.legcontroller);

        this.addArm(new BodyPartArm(-18, -8, -0, 0.0, [35, 40]));
        this.addArm(new BodyPartArm(+18, -8, +0, 0.2, [35, 40]));

        this.max_vel = 200;
        this.drag = 2.0;


        this.event.on(KEYCODE.Q, () => { this.rlocal -= 0.01; });
        this.event.on(KEYCODE.E, () => { this.rlocal += 0.01; });

        this.event.on(KEYCODE.A, () => { this.addForce(-512*engine.dtime(),  0); });
        this.event.on(KEYCODE.D, () => { this.addForce(+512*engine.dtime(),  0); });
        this.event.on(KEYCODE.W, () => { this.addForce( 0, -512*engine.dtime()); });
        this.event.on(KEYCODE.S, () => { this.addForce( 0, +512*engine.dtime()); });

    }

    private update_io( engine: Engine )
    {
        const tmp = vec2.temp
        tmp.setXY(0, 0);

        const keycodes = [KEYCODE.Q, KEYCODE.E, KEYCODE.A, KEYCODE.D, KEYCODE.W, KEYCODE.S];

        for (let K of keycodes)
        {
            if (IO.keyDown(K))
            {
                this.event.emit(K, null);
            }
        }

    }

    update( engine: Engine )
    {
        super.update(engine);
        this.update_io(engine);

        this.rope.bodies[0].setPosition(this.pos);
        this.legcontroller.update(engine);

        const ren = engine.getSystem(sys_Render);
        ren.view.mixXY(this.x, this.y, 0.01);

        this.rlocal = 0.2 * (this.vel.x / this.max_vel);
    }

    draw( engine: Engine )
    {
        imageMode(CENTER);
        this.head[0].draw(engine);

        if (this.legcontroller.legs[0].direction == -1)
        {
            this.arms[0].draw(engine);
            this.legcontroller.legs[0].draw(engine);

            imageMode(CENTER);
            image(this.img_body, this.x, this.y, 48, 48);

            this.legcontroller.legs[1].draw(engine);
            this.arms[1].draw(engine);
        }

        else
        {
            this.arms[1].draw(engine);
            this.legcontroller.legs[1].draw(engine);

            imageMode(CENTER);
            image(this.img_body, this.x, this.y, 48, 48);
    
            this.legcontroller.legs[0].draw(engine);
            this.arms[0].draw(engine);
        }
    
        this.rope.draw(engine);
    }

}


