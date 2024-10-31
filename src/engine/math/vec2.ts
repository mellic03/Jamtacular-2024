import { math } from "./math.js";


const vec2_temp = [];
const vec2_temp_count = 1024;


export default class vec2
{
    private static tmp_idx = 0;

    x: number;
    y: number;

    constructor( x: number = 0.0, y: number = 0.0 )
    {
        this.x = x;
        this.y = y;
    }

    static tmp( x=0, y=x ): vec2
    {
        vec2.tmp_idx = (vec2.tmp_idx + 1) % vec2_temp_count;
        return vec2_temp[vec2.tmp_idx].setXY(x, y);
    }

    static copy( v: vec2 ): vec2
    {
        return vec2.tmp(v.x, v.y);
    }

    static mix( u: vec2, v: vec2, a: number ): vec2
    {
        return vec2.tmp(u.x, u.y).mix(v, a);
    }

    setXY( x: number, y=x ): vec2
    {
        this.x = x;
        this.y = y;
        return this;
    }

    copy( v: vec2 ): vec2
    {
        this.x = v.x;
        this.y = v.y;
        return this;
    }

    add( v: vec2 ): vec2
    {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    addMul( v: vec2, n: number=1 ): vec2
    {
        this.x += n*v.x;
        this.y += n*v.y;
        return this;
    }

    addXY( x, y=x ): vec2
    {
        this.x += x;
        this.y += y;
        return this;
    }

    sub( v: vec2 ): vec2
    {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    subMul( v: vec2, n: number ): vec2
    {
        this.x -= n*v.x;
        this.y -= n*v.y;
        return this;
    }

    subXY( x, y=x ): vec2
    {
        this.x -= x;
        this.y -= y;
        return this;
    }

    mul( v: vec2 ): vec2
    {
        this.x *= v.x;
        this.y *= v.y;
        return this;
    }

    mulXY( x: number, y=x ): vec2
    {
        this.x *= x;
        this.y *= y;
        return this;
    }

    div( v: vec2 ): vec2
    {
        this.x /= v.x;
        this.y /= v.y;
        return this;
    }

    divXY( x: number, y=x ): vec2
    {
        this.x /= x;
        this.y /= y;
        return this;
    }

    dot( v: vec2 ): number
    {
        return this.x*v.x + this.y*v.y;
    }

    magSq(): number
    {
        return this.x*this.x + this.y*this.y;
    }

    mag(): number
    {
        const magSq = this.magSq();
    
        if (magSq < 0.00001)
        {
            return 0;
        }

        return Math.sqrt(magSq);
    }

    normalize(): vec2
    {
        const len = this.mag();
        this.x /= len;
        this.y /= len;
        return this;
    }

    reflect( N: vec2 ): vec2
    {
        const n = vec2.tmp().copy(N).normalize();
        const d = this.dot(n);

        this.x -= 2*d * n.x;
        this.y -= 2*d * n.y;

        return this;
    }

    distSq( v: vec2 ): number
    {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        return dx*dx + dy*dy;
    }

    dist( v: vec2 ): number
    {
        return Math.sqrt(this.distSq(v));
    }

    floor(): vec2
    {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
    }

    ceil(): vec2
    {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
    }

    displacement( start: vec2, end: vec2 ): vec2
    {
        this.copy(end);
        this.sub(start);
        return this;
    }

    direction( start: vec2, end: vec2 ): vec2
    {
        this.displacement(start, end);
        this.normalize();
        return this;
    }

    normalizeMul( n: number ): vec2
    {
        this.normalize();
        this.mulXY(n);
        return this;
    }

    mix( v: vec2, a: number ): vec2
    {
        this.x = math.mix(this.x, v.x, a);
        this.y = math.mix(this.y, v.y, a);
        return this;
    }

    mixXY( x: number, y: number, a: number ): vec2
    {
        this.x = math.mix(this.x, x, a);
        this.y = math.mix(this.y, y, a);
        return this;
    }

    rand( min: number, max: number ): vec2
    {
        this.x = random(min, max);
        this.y = random(min, max);
        return this;
    }

    angle(): number
    {
        let r = atan2(this.y, this.x);
        let d = 180.0 * (r / Math.PI);
            d = (180 + Math.round(d)) % 180;

        return ((d/180) * Math.PI);
    }

    /** Rotate a vector theta radians about the origin.
     * 
     * @param theta Angle in radians
     */
    rotate( theta: number ): vec2
    {
        const S = Math.sin(theta);
        const C = Math.cos(theta);

        const x = this.x;
        const y = this.y;

        this.x = (C*x - S*y);
        this.y = (S*x + C*y);
        return this;
    }

    moveTo( v: vec2, speed: number ): vec2
    {
        const tmp = vec2.tmp();

        tmp.copy(v);
        tmp.sub(this);
        tmp.mulXY(speed);

        this.add(tmp);
        return this;
    }

    moveToXY( x: number, y: number, speed: number ): vec2
    {
        const tmp = vec2.tmp().setXY(x, y);
        return this.moveTo(tmp, speed);
    }
};



for (let i=0; i<vec2_temp_count; i++)
{
    vec2_temp.push(new vec2(0,  0));
}

    