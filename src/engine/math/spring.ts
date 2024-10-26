import { idk_math } from "./math.js";
import vec2 from "./vec2.js";


export class Spring
{
    timer    = 0.0;
    duration = 1.0;
    private callback: Function;

    prev:    number;
    curr:    number;
    initial: number;
    target:  number;

    // prev_vel = 0;
    vel = 0;

    // prev_acc = 0;
    // curr_acc = 0;

    k1 = 0.03;
    k2 = 0.002;
    k3 = 0.0;

    damping   = 0.75;
    stiffness = 0.01;
    mass      = 1.0;

    constructor( initial: number, target: number, callback = (x) => {} )
    {
        this.curr     = initial;
        this.prev     = initial;
        this.initial  = initial;
        this.target   = target;
        this.callback = callback;
    }

    iterate(): number
    {
        const dt = idk_math.clamp(deltaTime / 1000.0, 0.0, 1.0/15.0);
        this.timer += dt;

        const force = (1.0 - this.stiffness) * (this.target - this.curr) - this.damping*this.vel;

        this.vel  += dt * (force / this.mass);
        this.prev  = this.curr;
        this.curr += dt * this.vel;

        if (idk_math.approxEqual(this.curr, this.target, 0.01))
        {
            // this.callback(this);
            const tmp = this.target;
            this.target = this.initial;
            this.initial = tmp;
        }

        return this.curr;
    }
}



export class vec2_Spring
{
    private callback: Function;


    prev:    vec2;
    curr:    vec2;
    initial: vec2;
    target:  vec2;

    vel = new vec2(0, 0);
    tmp = new vec2(0, 0);

    k1 = 0.03;
    k2 = 0.002;
    k3 = 0.0;

    damping   = 0.75;
    stiffness = 0.01;
    mass      = 1.0;

    constructor( initial: vec2, target: vec2, callback = (x) => {} )
    {
        this.curr    = initial;
        this.initial = initial;
        this.target  = target;
    }

    iterate( output: vec2 ): void
    {
        const dt = idk_math.clamp(deltaTime / 1000.0, 0.0, 1.0/15.0);

        const A = this.curr;
        const B = this.tmp;

        A.direction(this.curr, this.target);
        A.mul(1.0 - this.stiffness);

        B.copy(this.vel);
        B.mul(this.damping);

        A.sub(B);

        const distSq = A.distSq(this.target);

        if (idk_math.approxEqual(distSq, 0.0, 0.01))
        {
            this.callback(this);
        }

        output.copy(this.curr);
    }
}

