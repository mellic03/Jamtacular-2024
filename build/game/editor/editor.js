import { idk_Stack } from "../../engine/ds/idk_stack.js";
import { GameState } from "../../engine/gamestate.js";
import Render from "../../engine/sys-render.js";
import ui_Bounds from "../../engine/ui/bounds.js";
import ui_Grid from "../../engine/ui/grid.js";
import ui_Title from "../../engine/ui/title.js";
// import { GS_Dummy } from "../gameplay/state-paused.js";
export class GS_EditorTest extends GameState {
    constructor() {
        super();
        this.ui = new idk_Stack();
        this.ui.push(new ui_Grid(4, 5, new ui_Title("Editor")));
    }
    setup() {
        super.setup();
        // this.addSubstate(new GS_Dummy);
        // this.pushState(GS_Dummy);
    }
    enter() {
        super.enter();
    }
    exit() {
        super.exit();
    }
    update() {
        super.update();
        this.ui.top().update(new ui_Bounds(0, Render.width, 0, Render.height));
    }
    draw() {
        super.draw();
        Render.pushInverseViewTransform();
        this.ui.top().draw();
        Render.popInverseViewTransform();
    }
}
export class GS_Editor extends GameState {
    constructor() {
        super();
    }
    setup() {
        super.setup();
        this.addSubstate(new GS_EditorTest);
        this.pushState(GS_EditorTest);
    }
    // public enter(): void
    // {
    // }
    // public exit(): void
    // {
    // }
    // public update(): void
    // {
    //     // this.stack.top().update(new ui_Bounds(0, Render.width, 0, Render.height))
    // }
    draw() {
        super.draw();
    }
}
//# sourceMappingURL=editor.js.map