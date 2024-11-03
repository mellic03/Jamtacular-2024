import vec2 from "../../engine/math/vec2.js";
import CharacterFloating from "./CharacterFloating.js";
export default class CharacterDDL extends CharacterFloating {
    constructor(x, y, ropegroup, controller) {
        super(x, y, ropegroup, controller);
        this.grabbiness = 0;
    }
    update() {
        super.update();
    }
    draw() {
        super.draw();
    }
    move(x, y) {
        super.move(x, y);
    }
    interact(x, y, msg) {
        const dir = vec2.tmp(x, y).sub(this.world.pos).normalize();
    }
}
//# sourceMappingURL=CharacterDDL.js.map