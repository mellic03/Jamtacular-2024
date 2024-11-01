import { GameState, GameStateFlag, StateManager } from "../../../engine/gamestate.js";
import { IO, KEYCODE } from "../../../engine/IO.js";
import { GS_Region1 } from "../world/state-region1.js";


export class GS_Dummy extends GameState
{
    public enter():  void {  }
    public exit():   void {  }
    public update(): void {  }
    public draw():   void {  }
}



export class GS_Paused extends GameState
{
    public enter(): void
    {
        world.timeScale = 0;
    }


    public exit(): void
    {
        world.timeScale = 1;
    }


    public update(): void
    {
        
    }


    public draw(): void
    {
        
    }

}
