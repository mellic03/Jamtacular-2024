import { StateManager, GameState } from "../../../engine/gamestate.js";
import { Render } from "../../../engine/render.js";
import ui_Bounds from "../../../engine/ui/bounds.js";
import ui_Button from "../../../engine/ui/button.js";
import ui_List from "../../../engine/ui/list.js";
import ui_Title from "../../../engine/ui/title.js";
const transition = (A, B) => { StateManager.getState(A).transition(B); };
export class GS_SettingsGUI extends GameState {
    constructor() {
        super();
        this.renbounds = new ui_Bounds(0, 0, 1, 1);
        this.ui = new ui_List(new ui_Title("Settings"), new ui_Button("Return", () => { this.parent.popState(); }));
        const S = this.ui.style;
        S.minWidth = 512;
        S.maxWidth = 856;
        this.ui.updateStyle();
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
//# sourceMappingURL=ui-settings.js.map