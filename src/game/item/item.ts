import { Engine, __engine } from "../../engine/engine.js";
import { iRenderable, iTransformable, iUpdatable } from "../../engine/interface.js";
import { Transform } from "../../engine/transform.js";


export class Item implements iUpdatable, iRenderable, iTransformable
{
    public local: Transform;
    public world: Transform;
    public children = new Array<iTransformable>();

    constructor( x: number, y: number )
    {
        this.local = new Transform(x, y, 0);
        this.world = new Transform(0, 0, 0);
    }

    update(): void
    {

    }

    draw(): void
    {

    }
    
}

