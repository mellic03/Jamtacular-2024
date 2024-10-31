import { GameState } from "../../engine/gamestate.js";
import { StatePaused } from "./state-paused.js";
import Render from "../../engine/sys-render.js";


export class StateSetup extends GameState
{
    constructor()
    {
        super();
        Render.setBackground(150, 150, 150, 255);
    }


    public enter( fromstate?: GameState ): void
    {

    }


    public exit( tostate?: GameState ): void
    {
        
    }


    public update(): void
    {
        this.scene.stateTransition(StatePaused);

    }


    public draw(): void
    {

    }

}
