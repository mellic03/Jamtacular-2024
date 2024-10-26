import Engine from "../../../engine/engine.js";
import GameState from "../../../engine/gamestate/gamestate.js";
import ui_Button from "../../../engine/ui/button.js";
import ui_List from "../../../engine/ui/list.js";
import ui_Title from "../../../engine/ui/title.js";
import GameStateUI from "../gamestateui.js";


export default class Menu_SettingsAudio extends GameStateUI
{
    constructor( engine: Engine, name: string, parent: GameState = null )
    {
        super(engine, name, parent);

        this.ui_root = new ui_List(
            new ui_Title("Audio"),

            new ui_Button("Master Volume", () => {
                // engine.transitionGameState("settings-menu", "settings-menu-audio");
            }),

            new ui_Button("Something Else", () => {
                // engine.transitionGameState("settings-menu", "settings-menu-graphics");
            }),

            new ui_Button("Another Thing", () => {
                // engine.transitionGameState("settings-menu", "settings-menu-system");
            }),

            new ui_Button("Return", () => {
                this.transition("settings-menu");
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

