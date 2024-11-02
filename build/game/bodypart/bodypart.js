import { Transform } from "../../engine/transform.js";
export default class BodyPart {
    constructor(x, y) {
        this.children = new Array();
        this.direction = +1;
        this.local = new Transform(x, y, 0);
        this.world = new Transform(0, 0, 0);
    }
    update() {
    }
    draw() {
    }
}
//# sourceMappingURL=bodypart.js.map