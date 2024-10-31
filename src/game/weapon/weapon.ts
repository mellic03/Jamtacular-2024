import { iRenderable, iTransformable, iUpdatable } from "../../engine/interface";
import { Transform } from "../../engine/transform";



export class Weapon implements iUpdatable, iRenderable, iTransformable
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

    attack(): void
    {

    }

}

