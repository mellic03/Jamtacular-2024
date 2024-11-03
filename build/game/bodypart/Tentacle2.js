import { math } from "../../engine/math/math.js";
import vec2 from "../../engine/math/vec2.js";
import { EventEmitter } from "../../engine/sys-event.js";
import { Transform } from "../../engine/transform.js";
import { Game } from "../game.js";
import { GS_Gameplay } from "../state/gameplay.js";
class TentacleAggroFactorsJSON {
    constructor(config) {
        this.length = 1.0;
        this.mass = 1.0;
        this.drag = 1.0;
        this.friction = 1.0;
        this.speed = 1.0;
        this.width = 1.0;
        this.grav = 1.0;
        let data = config["aggroFactors"];
        if (data.length == 7) {
            return { ...data };
        }
        // const other: TentacleAggroFactorsJSON = 
        // for (let property in data)
        // {
        //     console.log(data[property]);
        // }
    }
}
export class TentacleConfigJSON {
    constructor(limbName, limbCount) {
        this.memberCount = 0;
        this.r_offset = [];
        this.g_offset = [];
        this.b_offset = [];
        for (let i = 0; i < limbCount; i++) {
            this.r_offset.push(0.5 * (Math.random() * 0.5 + 0.5));
            this.g_offset.push(0.5 * (Math.random() * 0.5 + 0.5));
            this.b_offset.push(0.5 * (Math.random() * 0.5 + 0.5));
        }
        const data = Game.LimbConfig[limbName];
        this.count = limbCount;
        this.segments = data["values"]["segments"];
        this.values = (({ count, ...rest }) => rest)(data["values"]);
        const toSingleMultiplierObject = ([aggro, invAggro, growth, invGrowth, rng]) => ({
            aggro, invAggro,
            growth, invGrowth,
            rng
        });
        this.multipliers = Object.fromEntries(Object.entries(data["multipliers"])
            .filter(([key]) => key !== "comment" && key !== "count") // Exclude 'comment' and 'count'
            .map(([key, value]) => [key, toSingleMultiplierObject(value)]));
    }
    getValue(name, n, aggression) {
        const value = this.values[name];
        const aggro = this.multipliers[name].aggro;
        const growth = this.multipliers[name].growth;
        const rng = this.multipliers[name].rng;
        const alpha = math.clamp(aggression, 0, 1);
        let growthwise = value * (pow(growth, n) + random(-rng, +rng));
        let ragewise = aggro * growthwise;
        let result = math.mix(growthwise, ragewise, alpha);
        return result;
    }
    getColor(alpha, aggression, velSq, out) {
        const a0 = alpha;
        const a1 = 0.002 * velSq;
        const a2 = a0 * a1 * aggression;
        // strokeWeight(2*this.bodies.length - 8*a0);
        // strokeWeight(16 - 8*a0);
        // strokeWeight(this.bodies[i].radius);
        // this.bodies[i+1].sprite.radius = 0.5 * (16 - 8*a0);
        const r = (50 + 100 * a2); // * (1.0 + this.r_offset);
        const g = (50); // * (1.0 + this.g_offset);
        const b = Math.max(50 - 50 * a2, 0); // * (1.0 + this.b_offset);
        out[0] = r;
        out[1] = g;
        out[2] = b;
    }
}
export var TentacleEvent;
(function (TentacleEvent) {
    TentacleEvent[TentacleEvent["NONE"] = 0] = "NONE";
    TentacleEvent[TentacleEvent["HIT_GROUND"] = 1] = "HIT_GROUND";
    TentacleEvent[TentacleEvent["LEFT_GROUND"] = 2] = "LEFT_GROUND";
})(TentacleEvent || (TentacleEvent = {}));
;
export class Tentacle extends EventEmitter {
    constructor(x, y, parent, config, ropegroup) {
        super();
        this.id = 0;
        this.aggression = 0.0;
        this.id = config.memberCount++;
        this.parent = parent;
        this.local = new Transform(x, y, 0);
        this.world = new Transform(0, 0, 0);
        this.config = config;
        this.bodies = new Array();
        this.joints = new Array();
        const segments = this.config.segments;
        for (let i = 0; i < segments; i++) {
            const width = this.config.getValue("width", i, 0);
            const B = new Sprite(x + 16 * i, y, width, width, "dynamic");
            ropegroup.add(B);
            this.bodies.push(B);
        }
        this.root = this.bodies[0];
        this.hand = this.bodies[segments - 1];
        (new RopeJoint(parent, this.root)).maxLength = this.config.getValue("length", 0, 0);
        for (let i = 0; i < segments - 1; i++) {
            const J = new RopeJoint(this.bodies[i], this.bodies[i + 1]);
            J.maxLength = this.config.getValue("length", i - 1, 0);
        }
        this.hand.collides(GS_Gameplay.groups.WORLD, () => {
            this.emit(TentacleEvent.HIT_GROUND);
        });
        this.hand.collides(GS_Gameplay.groups.PLAYER, () => {
        });
    }
    update_values() {
        const aggro = this.aggression;
        const segments = this.config.segments;
        for (let i = 0; i < segments; i++) {
            const B = this.bodies[i];
            B.radius = this.config.getValue("width", i + 1, aggro) / 2;
            B.mass = this.config.getValue("mass", i + 1, aggro);
            B.drag = this.config.getValue("drag", i + 1, aggro);
            B.gravityScale = this.config.getValue("grav", i + 1, aggro);
            B.friction = this.config.getValue("friction", i + 1, aggro);
            const disp = vec2.rand(-1, +1).mulXY(this.config.getValue("brownian", i, aggro));
            B.applyForce(disp.x, disp.y);
        }
    }
    update(aggression) {
        this.aggression = aggression;
        this.update_values();
        // this.root.moveTowards(this.world.x, this.world.y, 1.0);
    }
    draw(start = 0, end = this.config.segments) {
        const segments = this.config.segments;
        const color = [0, 0, 0];
        start *= segments;
        end *= segments;
        start = Math.floor(math.clamp(start, 0, segments - 1));
        end = Math.floor(math.clamp(end, start, segments - 1));
        if (start == 0) {
            const A = this.parent;
            const B = this.bodies[0];
            const rc = (1.0 + this.config.r_offset[this.id]);
            const gc = (1.0 + this.config.g_offset[this.id]);
            const bc = (1.0 + this.config.b_offset[this.id]);
            this.config.getColor(0, this.aggression, A.vel.magSq(), color);
            strokeWeight(2 * B.radius);
            stroke(color[0] * rc, color[1] * gc, color[2] * bc);
            line(A.x, A.y, B.x, B.y);
        }
        for (let i = start; i < end; i++) {
            const A = this.bodies[i + 0];
            const B = this.bodies[i + 1];
            // const A = vec2.tmp(this.bodies[i+0].x, this.bodies[i+0].y);
            // const B = vec2.tmp(this.bodies[i+1].x, this.bodies[i+1].y);
            const rc = (1.0 + this.config.r_offset[this.id]);
            const gc = (1.0 + this.config.g_offset[this.id]);
            const bc = (1.0 + this.config.b_offset[this.id]);
            this.config.getColor((i + 1) / segments, this.aggression, A.vel.magSq(), color);
            strokeWeight(2 * A.radius);
            stroke(color[0] * rc, color[1] * gc, color[2] * bc);
            line(A.x, A.y, B.x, B.y);
        }
        strokeWeight(1);
    }
    move(dx, dy) {
        dx = Math.sign(dx);
        dy = Math.sign(dy);
        const alpha = math.clamp(this.aggression, 0, 1);
        const scale = deltaTime / 16;
        const segments = this.config.segments;
        for (let i = 0; i < segments - 1; i++) {
            const B = this.bodies[i];
            const speed = this.config.getValue("speed", i, this.aggression);
            this.hand.applyForce(speed * dx, speed * dy);
        }
    }
}
;
//# sourceMappingURL=Tentacle2.js.map