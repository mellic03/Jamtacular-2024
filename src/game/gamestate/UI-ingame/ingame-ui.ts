import Engine from "../../../engine/engine.js";
import GameState from "../../../engine/gamestate/gamestate.js";
import ui_Grid from "../../../engine/ui/grid.js";
import ui_Image from "../../../engine/ui/image.js";
import GameStateUI from "../gamestateui.js";


export default class StateInGameUI extends GameStateUI
{
    constructor( engine: Engine, name: string, parent: GameState = null )
    {
        super(engine, name, parent);

        this.ui_root = new ui_Grid(
            new ui_Image("heart-red", 64),
            new ui_Image("heart-red", 64),
            new ui_Image("heart-red", 64)
        );

    }

}

