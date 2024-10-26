import vec2 from "../math/vec2.js";

let Identity: any;

export default class Transform
{
    localpos: vec2;
    worldpos: vec2;

    theta: number;
    rot: number;

    children: Array<Transform>;

    constructor( x: number, y: number, theta: number )
    {
        this.localpos = new vec2(x, y);
        this.worldpos = new vec2(0, 0);

        this.theta = theta;
        this.rot = theta;

        this.children = [];
    }

    computeHierarchy( parent: any = Identity )
    {
        this.rot = parent.rot + this.theta;

        this.worldpos.copy(this.localpos);
        this.worldpos.rotate(this.rot);
        this.worldpos.add(parent.worldpos);

        for (let child of this.children)
        {
            child.computeHierarchy(this);
        } 
    }

    from( x: number, y: number, theta: number ): void
    {
        this.localpos.from(x, y);
        this.theta = theta;
    }

    translateLocal( x: number, y: number ): void
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


Identity = new Transform(0, 0, 0);
