export default class vec2 {
    constructor(x = 0.0, y = 0.0) {
        this.x = x;
        this.y = y;
    }
    from(x, y) {
        this.x = x;
        this.y = y;
    }
    copy(v) {
        this.x = v.x;
        this.y = v.y;
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
    }
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
    }
    mul(n) {
        this.x *= n;
        this.y *= n;
    }
    div(n) {
        this.x /= n;
        this.y /= n;
    }
    floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
    }
    direction(start, end) {
        this.copy(end);
        this.sub(start);
    }
    normalizedDirection(start, end) {
        this.direction(start, end);
        this.normalize();
    }
    magSq() {
        return this.x * this.x + this.y * this.y;
    }
    mag() {
        return Math.sqrt(this.magSq());
    }
    distSq(v) {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        return dx * dx + dy * dy;
    }
    dist(v) {
        return Math.sqrt(this.distSq(v));
    }
    normalize() {
        const len = this.mag();
        this.x /= len;
        this.y /= len;
    }
    normalizeMul(n) {
        this.normalize();
        this.mul(n);
    }
    rand(min, max) {
        this.x = random(min, max);
        this.y = random(min, max);
    }
    angle() {
        return atan2(this.y, this.x);
    }
    /** Rotate a vector theta radians about the origin.
     *
     * @param theta Angle in radians
     */
    rotate(theta) {
        const S = Math.sin(theta);
        const C = Math.cos(theta);
        const x = this.x;
        const y = this.y;
        this.x = (C * x - S * y);
        this.y = (S * x + C * y);
    }
}
;
//# sourceMappingURL=vec2.js.map