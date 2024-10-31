import { idk_Stack } from "../engine/ds/idk_stack.js";
import { GameScene, SceneManager } from "../engine/gamestate.js";
import Render from "../engine/sys-render.js";
import ui_ElementBase from "../engine/ui/base.js";
import ui_Bounds from "../engine/ui/bounds.js";
import ui_Button from "../engine/ui/button.js";
import ui_Grid from "../engine/ui/grid.js";
import ui_List from "../engine/ui/list.js";
import ui_Title from "../engine/ui/title.js";
import { SceneGameplay } from "./game.js";
import { StateRegion1 } from "./state-game/state-region1.js";


// const gameplay = getScene(SceneGameplay);

const callback2 = () => { SceneManager.getScene(SceneGameplay).stateTransition(StateRegion1); };
const callback3 = () => { SceneManager.getScene(SceneGameplay).stateTransition(StateRegion1); };



export class SceneMainMenu extends GameScene
{
    private ui_stack     = new idk_Stack<ui_ElementBase>();
    private ui_ingame:   ui_Grid;
    private ui_mainmenu: ui_Grid;

    constructor()
    {
        super();

        const L = new ui_List(
            new ui_Title("Main"),
            new ui_Button("Continue", () => { this.makeInactive(); }),
            new ui_Button("StateRegion1", callback2),
            new ui_Button("Settings"),
            new ui_Button("Exit")
        );

        L.style.maxHeight = 9999;
        L.updateStyle();

        this.ui_mainmenu = new ui_Grid(1, 4, L);

        this.ui_ingame = new ui_Grid(5, 8);

        this.ui_stack.push(this.ui_mainmenu);
    }


    update(): void
    {
        this.ui_stack.top().update(new ui_Bounds(0, Render.width, 0, Render.height))
    }


    draw(): void
    {
        Render.pushInverseViewTransform();
        this.ui_stack.top().draw();
        Render.popInverseViewTransform();
    }

}
