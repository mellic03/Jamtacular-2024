import { idk_math } from "./math.js";
import vec2 from "./vec2.js";
export class Spring {
    constructor(initial, target, callback = (x) => { }) {
        this.timer = 0.0;
        this.duration = 1.0;
        // prev_vel = 0;
        this.vel = 0;
        // prev_acc = 0;
        // curr_acc = 0;
        this.k1 = 0.03;
        this.k2 = 0.002;
        this.k3 = 0.0;
        this.damping = 0.75;
        this.stiffness = 0.01;
        this.mass = 1.0;
        this.curr = initial;
        this.prev = initial;
        this.initial = initial;
        this.target = target;
        this.callback = callback;
    }
    iterate() {
        const dt = idk_math.clamp(deltaTime / 1000.0, 0.0, 1.0 / 15.0);
        this.timer += dt;
        const force = (1.0 - this.stiffness) * (this.target - this.curr) - this.damping * this.vel;
        this.vel += dt * (force / this.mass);
        this.prev = this.curr;
        this.curr += dt * this.vel;
        if (idk_math.approxEqual(this.curr, this.target, 0.01)) {
            // this.callback(this);
            const tmp = this.target;
            this.target = this.initial;
            this.initial = tmp;
        }
        return this.curr;
    }
}
export class vec2_Spring {
    constructor(initial, target, callback = (x) => { }) {
        this.vel = new vec2(0, 0);
        this.tmp = new vec2(0, 0);
        this.k1 = 0.03;
        this.k2 = 0.002;
        this.k3 = 0.0;
        this.damping = 0.75;
        this.stiffness = 0.01;
        this.mass = 1.0;
        this.curr = initial;
        this.initial = initial;
        this.target = target;
    }
    iterate(output) {
        const dt = idk_math.clamp(deltaTime / 1000.0, 0.0, 1.0 / 15.0);
        const A = this.curr;
        const B = this.tmp;
        A.direction(this.curr, this.target);
        A.mul(1.0 - this.stiffness);
        B.copy(this.vel);
        B.mul(this.damping);
        A.sub(B);
        const distSq = A.distSq(this.target);
        if (idk_math.approxEqual(distSq, 0.0, 0.01)) {
            this.callback(this);
        }
        output.copy(this.curr);
    }
}
//# sourceMappingURL=spring.js.map