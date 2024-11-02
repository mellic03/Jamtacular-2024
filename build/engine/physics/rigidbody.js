import vec2 from "../math/vec2.js";
class RigidBody {
    constructor(sprite, mass = 1, collider = "dynamic", shape = "box") {
        this.curr = new vec2(0, 0);
        this.prev = new vec2(0, 0);
        this.mixed = new vec2(0, 0);
        this.forces = new vec2(0, 0);
        this.acc = new vec2(0, 0);
        sprite.shape = shape;
        sprite.mass = mass;
        sprite.collider = collider;
        this.sprite = sprite;
        this.id = RigidBody.id_count++;
    }
    get x() {
        return this.sprite.x;
    }
    get y() {
        return this.sprite.y;
    }
    get pos() {
        return RigidBody.tmp_pos.setXY(this.sprite.x, this.sprite.y);
    }
    get vel() {
        return RigidBody.tmp_vel.setXY(this.sprite.vel.x, this.sprite.vel.y);
    }
    setPosition(pos) {
        this.sprite.x = pos.x;
        this.sprite.y = pos.y;
    }
    interpolatePosition(alpha) {
        this.mixed.copy(this.prev).mix(this.curr, alpha);
    }
    translate(v) {
        this.sprite.x += v.x;
        this.sprite.y += v.y;
    }
    set radius(r) {
        this.sprite.radius = r;
    }
    get radius() {
        return this.sprite.radius;
    }
    set mass(m) {
        this.sprite.mass = m;
    }
    get mass() {
        return this.sprite.mass;
    }
    set rot(theta) {
        this.sprite.rotation = theta;
    }
    get rot() {
        return this.sprite.rotation;
    }
    set drag(drag) {
        this.sprite.drag = drag;
    }
    get drag() {
        return this.sprite.drag;
    }
    moveTowards(pos, alpha = 0.5) {
        this.sprite.moveTowards(pos.x, pos.y, alpha);
    }
    moveTowardsXY(x, y, alpha = 0.5) {
        this.sprite.moveTowards(x, y, alpha);
    }
    applyForce(f) {
        this.sprite.applyForce(f.x, f.y);
    }
    applyForceXY(x, y) {
        this.sprite.applyForce(x, y);
    }
    update() {
        this.curr.setXY(this.sprite.x, this.sprite.y);
        this.prev.setXY(this.sprite.prevPos[0], this.sprite.prevPos[1]);
    }
    draw() {
    }
}
RigidBody.id_count = 0;
RigidBody.tmp_pos = new vec2(0, 0);
RigidBody.tmp_vel = new vec2(0, 0);
export default RigidBody;
//# sourceMappingURL=rigidbody.js.map