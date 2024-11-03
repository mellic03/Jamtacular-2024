import { StateManager, GameState } from "../../../engine/gamestate.js";
import { Render } from "../../../engine/render.js";
import ui_Bounds from "../../../engine/ui/bounds.js";
import ui_Button from "../../../engine/ui/button.js";
import ui_List from "../../../engine/ui/list.js";
import { setSyleSpanLimitAsRatio } from "../../../engine/ui/style.js";
import ui_Title from "../../../engine/ui/title.js";
import { GS_Editor, GS_EditorTest } from "../../editor/editor.js";
import { GameStateUserInput } from "../../game.js";
import { UserInputMsg } from "../userinput.js";
const transition = (A, B) => { StateManager.getState(A).transition(B); };
export class GS_PauseMenuGUI extends GameState {
    constructor() {
        super();
        this.renbounds = new ui_Bounds(0, 0, 1, 1);
        this.ui = new ui_List(new ui_Title("Paused"), new ui_Button("Continue", () => { GameStateUserInput.emit(UserInputMsg.UNPAUSE); }), new ui_Button("Editor", () => { transition(GS_Editor, GS_EditorTest); }), new ui_Button("Settings", () => { }), new ui_Button("Exit", () => { this.parent.popState(); }));
        setSyleSpanLimitAsRatio(this.ui.style, 1 / 60, 0.75, 1 / 60, 1.0);
        this.ui.updateStyle();
    }
    enter() {
    }
    exit() {
    }
    update() {
        super.update();
        this.renbounds.fromMinMax(0, Render.width, 0, Render.height);
        this.ui.update(this.renbounds);
    }
    draw() {
        super.draw();
        Render.pushInverseViewTransform();
        this.ui.draw();
        Render.popInverseViewTransform();
    }
}
//# sourceMappingURL=ui-pausemenu.js.map