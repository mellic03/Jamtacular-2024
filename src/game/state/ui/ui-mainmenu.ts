import { StateManager, GameState } from "../../../engine/gamestate.js";
import Render from "../../../engine/sys-render.js";
import ui_ElementBase from "../../../engine/ui/base.js";
import ui_Bounds from "../../../engine/ui/bounds.js";
import ui_Button from "../../../engine/ui/button.js";
import ui_List from "../../../engine/ui/list.js";
import { setSyleHeightLimit, setSyleSpanLimitAsPixels, setSyleSpanLimitAsRatio, setSyleWidthLimit } from "../../../engine/ui/style.js";
import ui_Title from "../../../engine/ui/title.js";
import { GS_Editor, GS_EditorTest } from "../../editor/editor.js";
import { Game, GameStateUserInput } from "../../game.js";
import { UserInputMsg } from "../userinput.js";
import { GS_Region1 } from "../world/state-region1.js";
import { GS_Region2 } from "../world/state-region2.js";
import { GS_Region3 } from "../world/state-region3.js";
import { GS_World } from "../world.js";
import { GS_SettingsGUI } from "./ui-settings.js";


const transition = (A, B) => { StateManager.getState(A).transition(B); };

export class GS_MainMenuGUI extends GameState
{
    private ui: ui_ElementBase;
    private renbounds = new ui_Bounds(0, 0, 1, 1);

    constructor()
    {
        super();

        this.ui = new ui_List(
            new ui_Title("Main"),
            new ui_Button("Continue", () => { GameStateUserInput.emit(UserInputMsg.UNPAUSE); }),
            new ui_Button("Region 1", () => { transition(GS_World,  GS_Region1) }),
            new ui_Button("Region 2", () => { transition(GS_World,  GS_Region2) }),
            new ui_Button("Region 3", () => { transition(GS_World,  GS_Region3) }),
            new ui_Button("Editor",   () => { transition(GS_Editor, GS_EditorTest) }),
            new ui_Button("Settings", () => { this.parent.pushState(GS_SettingsGUI) }),
            new ui_Button("Exit")
        );



        const S = this.ui.style;

        setSyleSpanLimitAsRatio(S, 1/60, 0.75, 1/60, 1.0);

        S.minWidth = 512;
        S.maxWidth = 856;

        S.minHeight = 512;
        S.maxHeight = 856;

        // setSyleSpanLimitAsRatio(this.ui.style, 1/60, 0.5, 1/60, 0.75);
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