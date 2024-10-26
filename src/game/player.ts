import Actor from "../engine/gameobject/actor.js";
import iRenderable from "../engine/render/renderable.js";
import idk_Camera from "../engine/gameobject/camera.js";
import { IO } from "../engine/IO.js";
import vec2 from "../engine/math/vec2.js";
import Limb from "./bodypart/limb.js";
import { idk_math } from "../engine/math/math.js";
import Engine from "../engine/engine.js";

export default class Player extends Actor implements iRenderable
{
    camera: idk_Camera;
    tmpvec: Array<vec2>;
    limb: Limb;

    constructor( x: number, y: number, engine: Engine )
    {
        super(x, y, 0.0);

        this.camera = new idk_Camera(engine.ren);
        this.giveChild(this.camera);

        this.tmpvec = [new vec2(0, 0), new vec2(0, 0), new vec2(0, 0), new vec2(0, 0)];
        this.limb   = new Limb(0, 0, 16, 32);
        this.giveChild(this.limb);
    }


    update()
    {
        super.update();

        this.tmpvec[0].from(mouseX, mouseY);
        this.camera.screenToWorld(this.tmpvec[0], this.tmpvec[1]);
        this.tmpvec[0].direction(this.transform.worldpos, this.tmpvec[1]);

        const A = this.limb.transform.theta;
        const B = this.tmpvec[0].angle();

        this.limb.transform.theta = idk_math.mixRadians(A, B, 0.05);


        if (IO.keyDown(IO.keycodes.A))
        {
            this.transform.translateLocal(-2, 0);
        }

        if (IO.keyDown(IO.keycodes.D))
        {
            this.transform.translateLocal(+2, 0);
        }
    
        if (IO.keyDown(IO.keycodes.W))
        {
            this.transform.translateLocal(0, -2);
        }

        if (IO.keyDown(IO.keycodes.S))
        {
            this.transform.translateLocal(0, +2);
        }


        if (IO.keyDown(IO.keycodes.E))
        {
            this.limb.contract(0.02);
        }

        if (IO.keyDown(IO.keycodes.Q))
        {
            this.limb.contract(-0.02);
        }
    }

    draw()
    {
        // this.tmpvec[0].from()
        this.camera.worldToScreen(this.transform.worldpos, this.tmpvec[0]);

        stroke(0, 255, 0, 255);
        circle(this.transform.x, this.transform.y, 24);
        // circle(this.tmpvec[0].x, this.tmpvec[0].y, 24);
    }

};

