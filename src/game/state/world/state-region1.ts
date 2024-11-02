import { GS_Region } from "./state-region.js";
// import { Actor } from "../../../engine/actor.js";


export class GS_Region1 extends GS_Region
{
    public enter(): void
    {
        noiseDetail(8, 0.6);
        noiseDetail(4, 0.5);
        super.enter();

        // const A = new Actor(0, 0, 64, 64);
        // console.log(A);
        // this.addActor(A);

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
    }

}
