// import { Actor } from "../../../engine/actor.js";
import { GS_Region } from "../world/state-region.js";
export class GS_Region1 extends GS_Region {
    enter() {
        noiseDetail(8, 0.6);
        super.enter();
        // this.renderables.push(new FloatRageTrigger(-300, -300));
        // this.renderables.push(new FloatCalmTrigger(+300, -300));
    }
    update() {
        super.update();
    }
    draw() {
        super.draw();
        console.log(`!![GS_Region1]11`);
    }
}
//# sourceMappingURL=state-region1.js.map