import vec2 from "../math/vec2.js";
let Identity;
export default class Transform {
    constructor(x, y, theta) {
        this.localpos = new vec2(x, y);
        this.worldpos = new vec2(0, 0);
        this.theta = theta;
        this.rot = theta;
        this.children = [];
    }
    computeHierarchy(parent = Identity) {
        this.rot = parent.rot + this.theta;
        this.worldpos.copy(this.localpos);
        this.worldpos.rotate(this.rot);
        this.worldpos.add(parent.worldpos);
        for (let child of this.children) {
            child.computeHierarchy(this);
        }
    }
    from(x, y, theta) {
        this.localpos.from(x, y);
        this.theta = theta;
    }
    translateLocal(x, y) {
        this.localpos.x += x;
        this.localpos.y += y;
    }
    get x() {
        return this.worldpos.x;
    }
    get y() {
        return this.worldpos.y;
    }
}
;
Identity = new Transform(0, 0, 0);
//# sourceMappingURL=transform.js.map