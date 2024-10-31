import { Engine, __engine } from "../engine.js";
import vec2 from "../math/vec2.js";
import { PHYS_GRAVITY, PHYS_TIMESTEP } from "./physics.js";

export default class RigidBody
{
    private static id_count = 0;
    private static tmp_pos = new vec2(0, 0);
    private static tmp_vel = new vec2(0, 0);

    sprite: Sprite;

    curr   = new vec2(0, 0);
    prev   = new vec2(0, 0);
    mixed  = new vec2(0, 0);
    forces = new vec2(0, 0);
    acc    = new vec2(0, 0);

    id:     number;

    constructor( sprite: Sprite, mass=1, collider="dynamic", shape="box" )
    {
        sprite.shape    = shape;
        sprite.mass     = mass;
        sprite.collider = collider;

        this.sprite     = sprite;
        this.id         = RigidBody.id_count++;
    }

    get x(): number
    {
        return this.sprite.x;
    }

    get y(): number
    {
        return this.sprite.y;
    }

    get pos(): vec2
    {
        return RigidBody.tmp_pos.setXY(this.sprite.x, this.sprite.y);
    }

    get vel(): vec2
    {
        return RigidBody.tmp_vel.setXY(this.sprite.vel.x, this.sprite.vel.y);
    }

    setPosition( pos: vec2 ): void
    {
        this.sprite.x = pos.x;
        this.sprite.y = pos.y;
    }

    interpolatePosition( alpha: number ): void
    {
        this.mixed.copy(this.prev).mix(this.curr, alpha);
    }

    translate( v: vec2 ): void
    {
        this.sprite.x += v.x;
        this.sprite.y += v.y;
    }

    set radius( r: number )
    {
        this.sprite.radius = r;
    }

    get radius(): number
    {
        return this.sprite.radius;
    }

    set mass( m: number )
    {
        this.sprite.mass = m;
    }

    get mass(): number
    {
        return this.sprite.mass;
    }

    set rot( theta: number )
    {
        this.sprite.rotation = theta;
    }

    get rot(): number
    {
        return this.sprite.rotation;
    }

    set drag( drag: number )
    {
        this.sprite.drag = drag;
    }

    get drag(): number
    {
        return this.sprite.drag;
    }

    moveTowards( pos: vec2, alpha: number = 0.5 )
    {
        this.sprite.moveTowards(pos.x, pos.y, alpha);
    }

    moveTowardsXY( x: number, y: number, alpha: number = 0.5 )
    {
        this.sprite.moveTowards(x, y, alpha);
    }

    applyForce( f: vec2 ): void
    {
        this.sprite.applyForce(f.x, f.y);
    }

    applyForceXY( x: number, y: number ): void
    {
        this.sprite.applyForce(x, y);
    }

    update()
    {
        this.curr.setXY(this.sprite.x, this.sprite.y);
        this.prev.setXY(this.sprite.prevPos[0], this.sprite.prevPos[1]);
    }


    draw()
    {

    }
}



