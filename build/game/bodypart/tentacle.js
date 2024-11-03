import vec2 from "../../engine/math/vec2.js";
import Rope from "../../engine/physics/rope.js";
import BodyPart from "./bodypart.js";
class TentacleDescription {
    constructor() {
        this.count = 8;
        // "factors": {
        //     "comment": "[ base,  growth,  rand ]",
        //     "count":    [  8.0,     1.0,   2.0 ],
        //     "length":   [ 35.0,     1.0,   5.0 ],
        //     "mass":     [ 64.0,    1.05,   0.0 ],
        //     "drag":     [  0.2,    1.15,   0.0 ],
        //     "width":    [ 24.0,    0.98,   0.0 ],
        //     "grav":     [  1.0,     1.0,   0.0 ]
        // },
    }
}
class FloatRopes1 extends Rope {
    constructor() {
        super(...arguments);
        this.aggression = 1.0;
        this.r_offset = 0.5 * (Math.random() * 0.5 + 0.5);
        this.g_offset = 0.5 * (Math.random() * 0.5 + 0.5);
        this.b_offset = 0.5 * (Math.random() * 0.5 + 0.5);
    }
    drawSegments(start, end) {
        for (let i = start; i < end; i++) {
            const A = vec2.copy(this.bodies[i + 0].pos);
            const B = vec2.copy(this.bodies[i + 1].pos);
            // this.bodies[i].sprite.gravityScale   = 0.75 * (1.0 - this.aggression) + 0.01;
            // this.bodies[i+1].sprite.gravityScale = 0.75 * (1.0 - this.aggression) + 0.01;
            const a0 = i / this.bodies.length;
            const a1 = 0.002 * this.bodies[i + 1].vel.magSq();
            const a2 = a0 * a1 * this.aggression;
            // strokeWeight(2*this.bodies.length - 8*a0);
            // strokeWeight(16 - 8*a0);
            strokeWeight(this.bodies[i].radius);
            // this.bodies[i+1].sprite.radius = 0.5 * (16 - 8*a0);
            const r = (50 + 100 * a2) * (1.0 + this.r_offset);
            const g = (50) * (1.0 + this.g_offset);
            const b = Math.max(50 - 50 * a2, 0) * (1.0 + this.b_offset);
            stroke(r, g, b);
            line(A.x, A.y, B.x, B.y);
        }
        strokeWeight(1);
    }
}
class FloatRopes2 extends Rope {
    constructor() {
        super(...arguments);
        this.aggression = 1.0;
        this.r_offset = 0.0 * (Math.random() * 0.5 + 0.5);
        this.g_offset = 0.0 * (Math.random() * 0.5 + 0.5);
        this.b_offset = 0.0 * (Math.random() * 0.5 + 0.5);
    }
    drawSegments(start, end) {
        for (let i = start; i < end; i++) {
            const A = vec2.copy(this.bodies[i + 0].pos);
            const B = vec2.copy(this.bodies[i + 1].pos);
            const a0 = i / this.bodies.length;
            const a1 = 0.002 * this.bodies[i + 1].vel.magSq();
            const a2 = a0 * a1 * this.aggression;
            strokeWeight(12 + 12 * a0);
            // strokeWeight(16 - 8*a0);
            const r = (50 + 255 * a2) * (1.0 + this.r_offset);
            const g = (50) * (1.0 + this.g_offset);
            const b = Math.max(50 - 50 * a2, 0) * (1.0 + this.b_offset);
            stroke(r, g, b);
            line(A.x, A.y, B.x, B.y);
        }
        strokeWeight(1);
    }
}
export var TentacleState;
(function (TentacleState) {
    TentacleState[TentacleState["Idle"] = 0] = "Idle";
    TentacleState[TentacleState["MovingTo"] = 1] = "MovingTo";
    TentacleState[TentacleState["Grabbing"] = 2] = "Grabbing";
    TentacleState[TentacleState["Retracting"] = 3] = "Retracting";
})(TentacleState || (TentacleState = {}));
export default class BodyPartTentacle extends BodyPart {
    constructor(x, y, ropegroup, count, length, mass, drag, friction, thickness, grav, lengthFactor, massFactor, dragFactor, frictionFactor, thicknessFactor, gravFactor) {
        super(x, y);
        this.state = TentacleState.Idle;
        this.grab_timer = 1.0;
        this.grabbing = false;
        this.aggression = 0.0;
        this.rope = new FloatRopes1(x, y, ropegroup, count, length, mass, drag, friction, thickness, grav, lengthFactor, massFactor, dragFactor, frictionFactor, thicknessFactor, gravFactor);
        this.children.push(this.rope);
        this.root = this.rope.bodies[0];
        this.hand = this.rope.bodies[this.rope.bodies.length - 1];
    }
    update() {
        super.update();
        circle(this.world.x, this.world.y, 12);
        this.rope.aggression = this.aggression;
        this.rope.update();
    }
    draw() {
        super.draw();
        this.rope.draw();
    }
    drawSegments(a, b) {
        const len = this.rope.bodies.length - 1;
        const start = Math.floor(a * len);
        const end = Math.floor(b * len);
        this.rope.drawSegments(start, end);
    }
    isGrabbing() {
        return this.grabbing;
    }
}
//# sourceMappingURL=tentacle.js.map