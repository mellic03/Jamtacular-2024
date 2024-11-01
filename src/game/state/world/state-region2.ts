import { GameState } from "../../../engine/gamestate.js";
import { GS_Region } from "./state-region.js";
import WorldInstance from "../../../engine/sys-world/worldinstance.js";


export class GS_Region2 extends GS_Region
{

    public enter(): void
    {
        noiseDetail(4, 0.5);
        super.enter();

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
