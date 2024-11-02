const math = {
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
    clamp(n, lo, hi) {
        return max(lo, min(n, hi));
    },
    mod(n, m) {
        return ((n % m) + m) % m;
    }
};
export { math };
//# sourceMappingURL=math.js.map