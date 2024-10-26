const idk_math = {
    mix(x, y, a) {
        return (1.0 - a) * x + a * y;
    },
    mixRadians(x, y, a) {
        let CS = (1 - a) * Math.cos(x) + a * Math.cos(y);
        let SN = (1 - a) * Math.sin(x) + a * Math.sin(y);
        return Math.atan2(SN, CS);
    },
    approxEqual(x, y, epsilon = 0.00001) {
        return Math.abs(x - y) <= epsilon;
    },
    min(x, y) {
        return (x < y) ? x : y;
    },
    max(x, y) {
        return (x > y) ? x : y;
    },
    clamp(lo, hi, n) {
        return max(lo, min(n, hi));
    }
};
export { idk_math };
//# sourceMappingURL=math.js.map