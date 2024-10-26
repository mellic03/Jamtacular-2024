import Actor from "./actor.js";
export default class idk_Camera extends Actor {
    constructor(ren) {
        super(0, 0);
        this.ren = ren;
    }
    worldToScreen(input, output) {
        output.copy(input);
        output.sub(this.transform.worldpos);
    }
    screenToWorld(input, output) {
        output.copy(input);
        output.x -= this.ren.xoffset;
        output.y -= this.ren.yoffset;
        output.add(this.transform.worldpos);
    }
    get x() {
        return this.transform.worldpos.x;
    }
    get y() {
        return this.transform.worldpos.y;
    }
}
//# sourceMappingURL=camera.js.map