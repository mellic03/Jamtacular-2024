import { GameState, SceneManager } from "../../engine/gamestate.js";
import { IO, KEYCODE } from "../../engine/IO.js";
import { SceneMainMenu } from "../ui.js";
import { StateGameplay } from "./state-gameplay.js";


export class StatePaused extends GameState
{
    constructor()
    {
        super();
    }


    public enter( fromstate?: GameState ): void
    {
        world.timeScale = 0;
    }


    public exit( tostate?: GameState ): void
    {
        world.timeScale = 1;
    }


    public update(): void
    {
        const menu = SceneManager.getScene(SceneMainMenu);

        if (!menu.isActive() || IO.keyTapped(KEYCODE.ESC))
        {
            menu.makeInactive();
            this.scene.stateTransition(StateGameplay);
        }
    }


    public draw(): void
    {

    }

}
