import { iTransformable } from "./interface.js";
import vec2 from "./math/vec2.js";


export function HierarchicalTransform( P: iTransformable, parent: Transform ): void
{ 
    // P.world.pos.copy(P.local.pos).add(parent.pos);
    P.world.copy(P.local).mult(parent);

    for (let C of P.children)
    {
        HierarchicalTransform(C, P.world);
    }
}



export class Transform
{
    static Identity = new Transform(0, 0, 0);

    public pos: vec2;
    public rot: number;

    constructor( x: number, y: number, theta: number )
    {
        this.pos = new vec2(x, y);
        this.rot = theta;
    }

    get x(): number
    {
        return this.pos.x;
    }

    get y(): number
    {
        return this.pos.y;
    }

    set x( x: number)
    {
        this.pos.x = x;
    }

    set y( y: number)
    {
        this.pos.y = y;
    }

    mult( parent: Transform ): Transform
    {
        this.pos.rotate(parent.rot);
        this.pos.add(parent.pos);
        this.rot += parent.rot;
        return this;
    }

    copy( T: Transform ): Transform
    {
        this.pos.copy(T.pos);
        this.rot = T.rot;
        return this;
    }
}

