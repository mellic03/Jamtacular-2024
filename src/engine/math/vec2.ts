import { math } from "./math.js";

export default class vec2
{
    static temp = new vec2(0, 0);
    static tmpA = new vec2(0, 0);
    static tmpB = new vec2(0, 0);
    static tmpC = new vec2(0, 0);

    x: number;
    y: number;

    constructor( x: number = 0.0, y: number = 0.0 )
    {
        this.x = x;
        this.y = y;
    }

    setXY( x: number, y: number = x ): vec2
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

    addXY( x, y ): vec2
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

    subXY( x, y=x ): vec2
    {
        this.x -= x;
        this.y -= y;
        return this;
    }

    mul( n: number ): vec2
    {
        this.x *= n;
        this.y *= n;
        return this;
    }

    div( n: number ): vec2
    {
        this.x /= n;
        this.y /= n;
        return this;
    }

    magSq(): number
    {
        return this.x*this.x + this.y*this.y;
    }

    mag(): number
    {
        return Math.sqrt(this.magSq());
    }

    normalize(): vec2
    {
        const len = this.mag();
        this.x /= len;
        this.y /= len;
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

    displacement( start: vec2, end: vec2 ): vec2
    {
        this.copy(end);
        this.sub(start);
        return this;
    }

    normalizedDirection( start: vec2, end: vec2 ): vec2
    {
        this.displacement(start, end);
        this.normalize();
        return this;
    }

    normalizeMul( n: number ): vec2
    {
        this.normalize();
        this.mul(n);
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
        return atan2(this.y, this.x);
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
        const tmp = vec2.temp;

        tmp.copy(v);
        tmp.sub(this);
        tmp.mul(speed);

        this.add(tmp);
        return this;
    }

    moveToXY( x: number, y: number, speed: number ): vec2
    {
        vec2.temp.setXY(x, y);
        return this.moveTo(vec2.temp, speed);
    }
};

