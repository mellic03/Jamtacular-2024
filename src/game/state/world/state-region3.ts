import { GameState } from "../../../engine/gamestate.js";
import { GS_Region } from "./state-region.js";
import WorldInstance from "../../../engine/sys-world/worldinstance.js";


export class GS_Region3 extends GS_Region
{

    public enter(): void
    {
        noiseDetail(3, 0.2);
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
