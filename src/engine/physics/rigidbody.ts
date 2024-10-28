import { Engine, __engine } from "../engine.js";
import { math } from "../math/math.js";
import vec2 from "../math/vec2.js";
import Transform from "../transform.js";
import { PHYS_GRAVITY, PHYS_MASS_SCALE, PHYS_TIMESTEP } from "./physics.js";


abstract class RigidBodyConstraint
{
    A: RigidBody;
    B: RigidBody;

    abstract update( engine: Engine ): void;
}


export class RigidBodyDistanceConstraint extends RigidBodyConstraint
{
    dist: number

    constructor( dist: number )
    {
        super();
        this.dist = dist;
    }

    update( engine: Engine ): void
    {
        const disp  = vec2.tmpA.displacement(this.A.curr_pos, this.B.curr_pos);
        const error = this.dist - disp.mag();
        const dir   = disp.normalize().mul(error);

        if (this.A.fixed == false && this.B.fixed == false)
        {
            this.A.curr_pos.addMul(dir, -0.5);
            this.B.curr_pos.addMul(dir, +0.5);
        }

        else if (this.A.fixed == true)
        {
            this.B.curr_pos.addMul(dir, +1.0);
        }

        else if (this.B.fixed == true)
        {
            this.A.curr_pos.addMul(dir, -1.0);
        }

    }
}


export default class RigidBody
{
    private static id_count = 0;
    private accum  = 0;

    curr_pos: vec2;
    prev_pos: vec2;
    lerp_pos: vec2;

    id:  number;
    vel: vec2;
    acc: vec2;
    mass: number;
    drag: number
    fixed: boolean;

    constraints: Array<RigidBodyConstraint>;

    constructor( x, y, mass=1, fixed=false )
    {
        this.id   = RigidBody.id_count++;

        this.curr_pos  = new vec2(x, y);
        this.prev_pos  = new vec2(x, y);
        this.lerp_pos  = new vec2(x, y);

        this.vel   = new vec2(0, 0);
        this.acc   = new vec2(0, 0);
        this.mass  = mass;
        this.drag  = 0.0001;
        this.fixed = fixed;

        this.constraints = [];
    }

    get pos(): vec2
    {
        return this.lerp_pos;
    }

    get x(): number
    {
        return this.lerp_pos.x;
    }

    get y(): number
    {
        return this.lerp_pos.y;
    }

    setPosition( v: vec2 ): void
    {
        this.curr_pos.copy(v);
    }

    interpolatePosition( alpha: number ): vec2
    {
        // return this.lerp_pos.copy(this.curr_pos);
        return this.lerp_pos.copy(this.prev_pos).mix(this.curr_pos, alpha);
    }

    addConstraint( constraint: RigidBodyConstraint, body: RigidBody )
    {
        constraint.A = this;
        constraint.B = body;
        this.constraints.push(constraint);
    }

    translate( v: vec2 ): void
    {
        this.curr_pos.add(v);
    }

    translateXY( x: number, y: number ): void
    {
        this.curr_pos.addXY(x, y);
    }

    addForce( force: vec2 ): void
    {
        this.acc.add(force);
    }

    addForceXY( x: number, y: number ): void
    {
        this.acc.addXY(x, y);
    }

    moveTo( position: vec2, speed: number = 0.5 )
    {
        const dir = vec2.temp.displacement(this.curr_pos, position).mul(speed);
        this.curr_pos.add(dir);
    }

    integrate( engine: Engine )
    {
        const dt = PHYS_TIMESTEP;

        for (let C of this.constraints)
        {
            C.update(engine);
        }


        const G    = PHYS_GRAVITY*PHYS_MASS_SCALE*this.mass;
        const prev = vec2.tmpA.copy(this.curr_pos);
        const acc  = vec2.tmpB.copy(this.acc).addXY(0, G).mul(dt*dt);
    
        // const tmp = vec2.temp.copy(this.prev_pos);
            //   tmp.moveTo(this.curr_pos, 0);

        this.curr_pos.mul(2.0).sub(this.prev_pos).add(acc);
        this.prev_pos.copy(prev);
    
        this.vel.copy(this.curr_pos).sub(this.prev_pos).div(dt);
        this.acc.setXY(0, 0);
    }

    draw( engine: Engine )
    {

    }
}
