import { __engine } from "../../engine/engine.js";
import { iRenderable, iTransformable, iUpdatable } from "../../engine/interface.js";
import { Transform } from "../../engine/transform.js";



export default class BodyPart implements iUpdatable, iRenderable, iTransformable
{
    local: Transform;
    world: Transform;
    children = new Array<iTransformable>();

    direction: number = +1;

    constructor( x: number, y: number )
    {
        this.local = new Transform(x, y, 0);
        this.world = new Transform(0, 0, 0);
    }

    update()
    {

    }

    draw()
    {

    }

}

