import ui_Grid from "../../../engine/ui/grid.js";
import ui_Image from "../../../engine/ui/image.js";
import GameStateUI from "../gamestateui.js";
export default class StateInGameUI extends GameStateUI {
    constructor(engine, name, parent = null) {
        super(engine, name, parent);
        this.ui_root = new ui_Grid(new ui_Image("heart-red", 64), new ui_Image("heart-red", 64), new ui_Image("heart-red", 64));
    }
}
//# sourceMappingURL=ingame-ui.js.map