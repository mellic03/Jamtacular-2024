import vec2 from "./math/vec2.js";
export function HierarchicalTransform(P, parent) {
    // P.world.pos.copy(P.local.pos).add(parent.pos);
    P.world.copy(P.local).mult(parent);
    for (let C of P.children) {
        HierarchicalTransform(C, P.world);
    }
}
export class Transform {
    constructor(x, y, theta) {
        this.pos = new vec2(x, y);
        this.rot = theta;
    }
    get x() {
        return this.pos.x;
    }
    get y() {
        return this.pos.y;
    }
    set x(x) {
        this.pos.x = x;
    }
    set y(y) {
        this.pos.y = y;
    }
    mult(parent) {
        this.pos.rotate(parent.rot);
        this.pos.add(parent.pos);
        this.rot += parent.rot;
        return this;
    }
    copy(T) {
        this.pos.copy(T.pos);
        this.rot = T.rot;
        return this;
    }
}
Transform.Identity = new Transform(0, 0, 0);
//# sourceMappingURL=transform.js.map