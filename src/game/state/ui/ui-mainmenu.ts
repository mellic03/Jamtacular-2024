import { idk_Stack } from "../../../engine/ds/idk_stack.js";
import { StateManager, GameState } from "../../../engine/gamestate.js";
import Render from "../../../engine/sys-render.js";
import ui_ElementBase from "../../../engine/ui/base.js";
import ui_Bounds from "../../../engine/ui/bounds.js";
import ui_Button from "../../../engine/ui/button.js";
import ui_List from "../../../engine/ui/list.js";
import ui_Title from "../../../engine/ui/title.js";
import { GS_Editor, GS_EditorTest } from "../../editor/editor.js";
import { GS_Region1 } from "../world/state-region1.js";
import { GS_Region2 } from "../world/state-region2.js";
import { GS_Region3 } from "../world/state-region3.js";
import { GS_World } from "../world/world.js";



const transition = (A, B) => { StateManager.getState(A).transition(B); };


export class GS_MainMenuGUI extends GameState
{
    // private ui = new idk_Stack<ui_ElementBase>();
    private ui: ui_ElementBase;
    private renbounds = new ui_Bounds(0, 0, 1, 1);

    constructor()
    {
        super();

        this.ui = new ui_List(
            new ui_Title("Main"),
            new ui_Button("Continue", () => { this.makeInactive(); }),
            new ui_Button("Region 1", () => { transition(GS_World,  GS_Region1) }),
            new ui_Button("Region 2", () => { transition(GS_World,  GS_Region2) }),
            new ui_Button("Region 3", () => { transition(GS_World,  GS_Region3) }),
            new ui_Button("Editor",   () => { transition(GS_Editor, GS_EditorTest) }),
            new ui_Button("Settings"),
            new ui_Button("Exit")
        );

        this.ui.style.maxHeight = 9999;
        this.ui.updateStyle();
    }



    public update(): void
    {
        super.update();

        this.renbounds.fromMinMax(0, Render.width, 0, Render.height);
        this.ui.update(this.renbounds);
    }



    public draw(): void
    {
        super.draw();

        Render.pushInverseViewTransform();
        this.ui.draw();
        Render.popInverseViewTransform();
    }

}