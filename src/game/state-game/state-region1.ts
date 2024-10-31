import { GameState } from "../../engine/gamestate.js";
import WorldInstance from "../../engine/sys-world/worldinstance.js";
import { StateGameplay } from "./state-gameplay.js";


export class StateRegion1 extends GameState
{
    worldData: WorldInstance;
    
    constructor()
    {
        super();
    }


    public enter( fromstate?: GameState ): void
    {
        if (!this.worldData)
        {
            this.worldData = new WorldInstance().generateWorld(0, 0, 128, 128, 32);
        }

    }


    public exit( tostate?: GameState ): void
    {
        
    }


    public update(): void
    {
        if (this.worldData.isReady() == false)
        {
            console.log("Not ready");
            return;
        }

        console.log("Ready!");

        this.scene.stateTransition(StateGameplay);

    }


    public draw(): void
    {
        // if (this.worldData.isReady() == false)
        // {
        //     return;
        // }


    }

}
