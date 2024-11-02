import { Transform } from "../../engine/transform";
export class Weapon {
    constructor(x, y) {
        this.children = new Array();
        this.local = new Transform(x, y, 0);
        this.world = new Transform(0, 0, 0);
    }
    update() {
    }
    draw() {
    }
    attack() {
    }
}
//# sourceMappingURL=weapon.js.map