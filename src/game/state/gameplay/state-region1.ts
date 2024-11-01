// import { Actor } from "../../../engine/actor.js";
import { GS_Region } from "../world/state-region.js";


export class GS_Region1 extends GS_Region
{
    public enter(): void
    {
        noiseDetail(8, 0.6);
        super.enter();

        // this.renderables.push(new FloatRageTrigger(-300, -300));
        // this.renderables.push(new FloatCalmTrigger(+300, -300));
    }


    public update(): void
    {
        super.update();
            
    }


    public draw(): void
    {
        super.draw();
        console.log(`!![GS_Region1]11`);
    }

}
