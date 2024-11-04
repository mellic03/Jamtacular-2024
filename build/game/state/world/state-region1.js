import { GS_Region } from "./state-region.js";
// import { Actor } from "../../../engine/actor.js";
export class GS_Region1 extends GS_Region {
    enter() {
        noiseDetail(3, 0.5);
        super.enter();
        // const A = new Actor(0, 0, 64, 64);
        // console.log(A);
        // this.addActor(A);
        // this.renderables.push(new FloatRageTrigger(-300, -300));
        // this.renderables.push(new FloatCalmTrigger(+300, -300));
    }
    update() {
        super.update();
    }
    draw() {
        super.draw();
    }
}
//# sourceMappingURL=state-region1.js.map