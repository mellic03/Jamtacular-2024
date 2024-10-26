import Transform from "./transform.js";
export default class Actor {
    constructor(x, y, theta = 0.0) {
        this.transform = new Transform(x, y, theta);
        this.children = [];
    }
    getID() {
        return this._id;
    }
    giveChild(obj) {
        this.children.push(obj);
        this.transform.children.push(obj.transform);
    }
    update() { }
    draw(ren) { }
}
//# sourceMappingURL=actor.js.map