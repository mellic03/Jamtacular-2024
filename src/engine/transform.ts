import vec2 from "./math/vec2.js";

export default class Transform
{
    public static I = new Transform(0, 0, 0);

    localpos: vec2;
    worldpos: vec2;

    localrot: number;
    worldrot: number;

    parent:   Transform;
    children: Array<Transform>;

    constructor( x: number, y: number, theta: number )
    {
        this.localpos = new vec2(x, y);
        this.worldpos = new vec2(0, 0);

        this.localrot = theta;
        this.worldrot = theta;

        this.parent   = Transform.I;
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

    ForwardKinematics( parent: Transform = Transform.I )
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

    get x()
    {
        return this.worldpos.x;
    }
    
    get y()
    {
        return this.worldpos.y;
    }

};

