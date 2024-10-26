import NPC from "./npc";
class Enemy1 extends NPC {
    update() {
        super.update();
    }
    draw() {
        stroke(0, 255, 0, 255);
        circle(this.transform.x, this.transform.y, 24);
    }
}
//# sourceMappingURL=enemy1.js.map