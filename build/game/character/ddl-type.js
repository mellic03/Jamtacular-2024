import vec2 from "../../engine/math/vec2.js";
import CharacterFloating from "./CharacterFloating.js";
// class TentacleDDL extends BodyPartTentacle
// {
//     constructor( x: number, y: number, count=8, length=32, mass=0.25, thickness=8 )
//     {
//         super(x, y, ropegroup, count, length, mass, thickness);
//     }
//     grab( x: number, y: number )
//     {
//         this.hand.moveTowardsXY(x, y);
//     }
// }
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
//# sourceMappingURL=ddl-type.js.map