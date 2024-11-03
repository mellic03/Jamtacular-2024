import ui_Button from "../../../engine/ui/button.js";
import ui_List from "../../../engine/ui/list.js";
import { Render } from "../../../engine/render.js";
import ui_Bounds from "../../../engine/ui/bounds.js";
import ui_Style from "../../../engine/ui/style.js";
import ui_PMinus, { ui_ValueRef } from "../../../engine/ui/pminus.js";
import ui_Grid from "../../../engine/ui/grid.js";
import { GameState } from "../../../engine/gamestate.js";
class TestList extends ui_List {
    constructor(...children) {
        let style = new ui_Style();
        style.align = [ui_Style.CENTER, ui_Style.CENTER];
        super(...children);
        this.tmp = new ui_Bounds(0, 0, 1, 1);
        this.btn = new Array();
        this.tmp = new ui_Bounds(0, 0, 1024, 1024);
    }
    update(bounds) {
        super.update(bounds);
    }
}
class TestButton extends ui_Button {
    constructor(label) {
        super(label);
        let style = new ui_Style([50, 50, 50, 225], [255, 255, 255, 255]);
        style.padding = [16, 16, 16, 16];
        style.radius = [4, 4, 4, 4];
        style.align = [ui_Style.CENTER, ui_Style.CENTER];
        style.maxWidth = 9999;
        style.maxHeight = 128;
        style.minWidth = 4;
        style.minHeight = 4;
        this.updateStyle(style);
    }
}
export class UI_InspectCharacter extends GameState {
    constructor() {
        super();
        this.valueA = new ui_ValueRef(0);
        this.ui = new ui_Grid(1, 1, new ui_PMinus("ui_PMinus Test", this.valueA));
        this.ui.style.align = [ui_Style.CENTER, ui_Style.CENTER];
        this.ui.updateStyle(this.ui.style);
    }
    enter() {
    }
    exit() {
    }
    update() {
        // const C = Game.getSelectedCharacter();
        this.ui.update(new ui_Bounds(0, Render.width, 0, Render.height));
    }
    draw() {
        this.ui.draw();
    }
}
//# sourceMappingURL=ui-character.js.map