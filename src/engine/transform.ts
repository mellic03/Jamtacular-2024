import vec2 from "./math/vec2.js";




export interface iHierarchical
{
    local: Transform2;
    world: Transform2;
    children: Array<iHierarchical>;
}


export function HierarchicalTransform( P: iHierarchical, parent: Transform2 ): void
{ 
    // P.world.pos.copy(P.local.pos).add(parent.pos);
    P.world.copy(P.local).mult(parent);

    for (let C of P.children)
    {
        HierarchicalTransform(C, P.world);
    }
}



export class Transform2
{
    static Identity = new Transform2(0, 0, 0);

    pos: vec2;
    rot: number;

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


    mult( parent: Transform2 ): Transform2
    {
        this.pos.rotate(parent.rot);
        this.pos.add(parent.pos);
        this.rot += parent.rot;
        return this;
    }

    copy( T: Transform2 ): Transform2
    {
        this.pos.copy(T.pos);
        this.rot = T.rot;
        return this;
    }
}




export default class Transform
{
    public static I = new Transform(0, 0, 0);

    localpos: vec2;
    worldpos: vec2;

    localrot: number;
    worldrot: number;

    parent:   Transform;
    children: Array<Transform>;

    constructor( x: number, y: number, theta: number, parent: Transform = Transform.I )
    {
        this.localpos = new vec2(x, y);
        this.worldpos = new vec2(0, 0);

        this.localrot = theta;
        this.worldrot = theta;

        this.parent   = parent;
        this.children = [];
    }

    mult( parent: Transform )
    {
        this.worldrot = parent.worldrot + this.localrot;

        this.worldpos.copy(this.localpos);
        this.worldpos.rotate(parent.worldrot);
        this.worldpos.add(parent.worldpos);
    }

    InverseKinematics( length: number )
    {
        
    }

    ForwardKinematics( parent: Transform = this.parent )
    {
        this.mult(parent);
    
        for (let child of this.children)
        {
            child.ForwardKinematics(this);
        } 
    }

    from( x: number, y: number, theta: number ): void
    {
        this.localpos.setXY(x, y);
        this.localrot = theta;
    }

    translate( x: number, y: number ): void
    {
        this.localpos.x += x;
        this.localpos.y += y;
    }

    copy( T: Transform ): void
    {
        this.localpos.copy(T.localpos);
        this.worldpos.copy(T.worldpos);

        this.localrot = T.localrot;
        this.worldrot = T.worldrot;
    }

    get x()
    {
        return this.worldpos.x;
    }
    
    get y()
    {
        return this.worldpos.y;
    }

};

