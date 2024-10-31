import { Engine, __engine } from "./engine.js";
import vec2 from "./math/vec2.js";
import Transform from "./transform.js";
import { math } from "./math/math.js";




export default class Actor
{
    private pos_prev  = new vec2(0, 0);
    private pos_delta = new vec2(0, 0);

    public parent:    Actor | null;
    public children:  Array<Actor>;
    public transform: Transform;

    public vel     = new vec2(0, 0);
    public max_vel = 500.0;
    public drag = 0.5;

    constructor( x: number = 0, y: number = 0, theta: number = 0 )
    {
        this.children  = new Array<Actor>;
        this.transform = new Transform(x, y, theta);

        // const og_update = this.update;
        // this.update = ( engine: Engine ) => {
        //   Actor.prototype.update.call(this, engine);
        //   return og_update.call(this, engine);
        // };
    }

    get delta(): vec2
    {
        return this.pos_delta;
    }

    get posWorld(): vec2
    {
        return this.transform.worldpos;
    }

    get posLocal(): vec2
    {
        return this.transform.localpos;
    }

    get xLocal(): number
    {
        return this.posLocal.x;
    }

    get yLocal(): number
    {
        return this.posLocal.y;
    }

    get rlocal(): number
    {
        return this.transform.localrot;
    }

    set xLocal( n: number )
    {
        this.posLocal.x = n;
    }

    set yLocal( n: number )
    {
        this.posLocal.y = n;
    }

    set rlocal( r: number )
    {
        this.transform.localrot = r;
    }



    get pos()
    {
        return this.transform.worldpos;
    }

    get x()
    {
        return this.pos.x;
    }

    get y()
    {
        return this.pos.y;
    }

    set x( n )
    {
        this.transform.localpos.x = n;
    }

    set y( n )
    {
        this.transform.localpos.y = n;
    }

    pushChild( child: Actor ): void
    {
        this.children.push(child);
        child.parent = this;
        this.transform.children.push(child.transform);
    }

    popChild(): Actor
    {
        return this.children.pop();
    }

    update( engine: Engine ): void
    {
        const dt = deltaTime / 1000.0;
        const a  = math.clamp(this.drag*dt, 0, 1);

        this.pos_prev.copy(this.transform.localpos);

        this.transform.localpos.x += dt*this.vel.x;
        this.transform.localpos.y += dt*this.vel.y;
        this.vel.mixXY(0, 0, a);

        this.pos_delta.displacement(this.pos_prev, this.pos);

        for (let child of this.children)
        {
            child.update(engine);
        }
    }

    draw( engine: Engine ): void
    {

    }

    addForce( x: number, y: number )
    {
        this.vel.addXY(x, y);
    }

    rotate( theta: number ): void
    {
        this.rlocal += theta;
    }

    move( x: number, y: number ): void
    {
        this.transform.localpos.x += x;
        this.transform.localpos.y += y;
    }

    moveTo( pos: vec2, speed=1 ): void
    {
        this.transform.localpos.moveTo(pos, speed);
    }

    interact( x: number, y: number, msg: string ): void
    {

    }

}
