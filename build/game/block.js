import Actor from "../engine/gameobject/actor.js";
export default class Block extends Actor {
    draw() {
        rectMode(CENTER);
        fill(0, 255, 0, 150);
        rect(this.transform.x, this.transform.y, 32, 32);
    }
}
//# sourceMappingURL=block.js.map