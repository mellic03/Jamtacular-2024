import Engine from "../../../engine/engine.js";
import GameState from "../../../engine/gamestate/gamestate.js";
import ui_Button from "../../../engine/ui/button.js";
import ui_List from "../../../engine/ui/list.js";
import GameStateUI from "../gamestateui.js";
import Menu_Settings from "./settings.js";
import Menu_Credits from "./credits.js";
import ui_Title from "../../../engine/ui/title.js";
import ui_Image from "../../../engine/ui/image.js";
import { ImgManager } from "../../../engine/image.js";


export default class StateMainMenu extends GameStateUI
{
    constructor( engine: Engine, name: string, parent: GameState = null )
    {
        super(engine, name, parent);

        parent.addChildState(new Menu_Settings(engine, "settings-menu", parent));
        parent.addChildState(new Menu_Credits(engine, "credits-menu", parent));

        this.ui_root = new ui_List(
            new ui_Title("Paused"),

            new ui_Button("Continue", () => {
                this.transition("gameui");
            }),

            new ui_Button("Settings", () => {
                this.transition("settings-menu");
            }),

            new ui_Button("Credits", () => {
                this.transition("credits-menu");
            })

        );
    }

    enter( prev: GameState ): void
    {

    }

    exit( next: GameState ): void
    {

    }

}

