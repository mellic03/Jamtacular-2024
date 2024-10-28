

const math = {
    mix( x: number, y: number, a: number ): number
    {
        return (1.0 - a)*x + a*y;
    },

    mixRadians( x: number, y: number, a: number )
    {
        let CS = (1-a)*Math.cos(x) + a*Math.cos(y);
        let SN = (1-a)*Math.sin(x) + a*Math.sin(y);
        return Math.atan2(SN,CS);
    },

    approxEqual( x: number, y: number, epsilon: number = 0.00001)
    {
        return Math.abs(x-y) <= epsilon;
    },

    min( x: number, y: number )
    {
        return (x < y) ? x : y;
    },

    max( x: number, y: number )
    {
        return (x > y) ? x : y;
    },

    clamp( lo: number, hi: number, n: number )
    {
        return max(lo, min(n, hi));
    }
};


export { math };

