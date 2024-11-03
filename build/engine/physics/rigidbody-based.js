import vec2 from "../math/vec2.js";
import { PHYS_GRAVITY, PHYS_TIMESTEP } from "./physics.js";
class RigidBodyConstraint {
}
export class BasedRigidBodyDistanceConstraint extends RigidBodyConstraint {
    constructor(dist) {
        super();
        this.dist = dist;
    }
    update() {
        // const disp  = vec2.tmp().displacement(this.A.curr_pos, this.B.curr_pos);
        // const error = this.dist - disp.mag();
        // const dir   = disp.normalize().mul(error);
        // if (this.A.fixed == false && this.B.fixed == false)
        // {
        //     this.A.curr_pos.addMul(dir, -0.5);
        //     this.B.curr_pos.addMul(dir, +0.5);
        // }
        // else if (this.A.fixed == true)
        // {
        //     this.B.curr_pos.addMul(dir, +1.0);
        // }
        // else if (this.B.fixed == true)
        // {
        //     this.A.curr_pos.addMul(dir, -1.0);
        // }
    }
}
class BasedRigidBody {
    constructor(x, y, mass = 1, fixed = false) {
        this.accum = 0;
        this.friction_time = 0;
        this.id = BasedRigidBody.id_count++;
        this.curr_pos = new vec2(x, y);
        this.prev_pos = new vec2(x, y);
        this.lerp_pos = new vec2(x, y);
        this.curr_vel = new vec2(0, 0);
        this.prev_vel = new vec2(0, 0);
        this.forces = new vec2(0, 0);
        this.acc = new vec2(0, 0);
        this.mass = mass;
        this.drag = 0.001;
        this.elasticity = 0.2;
        this.friction = 0.0;
        this.fixed = fixed;
        this.radius = 32.0;
        this.constraints = [];
    }
    get curr() {
        return this.curr_pos;
    }
    get prev() {
        return vec2.copy(this.prev_pos);
    }
    get vcurr() {
        return vec2.copy(this.curr_vel);
    }
    get vprev() {
        return vec2.copy(this.prev_vel);
    }
    setPosition(x, y) {
        // this.prev_pos.setXY(x, y);
        this.curr_pos.setXY(x, y);
    }
    interpolatePosition(alpha) {
        return this.lerp_pos.copy(this.prev_pos).mix(this.curr_pos, alpha);
    }
    addConstraint(constraint, body) {
        constraint.A = this;
        constraint.B = body;
        this.constraints.push(constraint);
    }
    addForceXY(x, y) {
        this.forces.addXY((x / this.mass), (y / this.mass));
    }
    addForce(force) {
        this.addForceXY(force.x, force.y);
    }
    moveTo(position, speed = 0.5) {
        const dir = vec2.tmp().displacement(this.curr_pos, position).mulXY(speed);
        this.curr_pos.add(dir);
    }
    integrate() {
        const dt = PHYS_TIMESTEP;
        const G = vec2.tmp(0, PHYS_GRAVITY * this.mass);
        const acc = vec2.copy(this.acc).add(this.forces).add(G).mulXY(dt * dt);
        this.forces.setXY(0, 0);
        const old_prev = vec2.copy(this.prev_pos);
        const old_curr = vec2.copy(this.curr_pos);
        this.curr_pos.mulXY(2).sub(this.prev_pos).add(acc);
        this.prev_pos.copy(old_curr);
        this.prev_vel.copy(this.curr_vel);
        this.curr_vel.copy(this.curr_pos).sub(this.prev_pos);
    }
    draw() {
    }
}
BasedRigidBody.id_count = 0;
export default BasedRigidBody;
//# sourceMappingURL=rigidbody-based.js.map