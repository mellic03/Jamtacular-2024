import ui_Button from "../../../engine/ui/button.js";
import ui_Label from "../../../engine/ui/label.js";
import ui_List from "../../../engine/ui/list.js";
import ui_Title from "../../../engine/ui/title.js";
import GameStateUI from "../gamestateui.js";
export default class Menu_Credits extends GameStateUI {
    constructor(engine, name, parent = null) {
        super(engine, name, parent);
        this.ui_root = new ui_List(new ui_Title("Credits"), new ui_Label("Credits A"), new ui_Label("Credits B"), new ui_Label("Credits C"), new ui_Label("Credits D"), new ui_Button("Return", () => {
            this.transition("mainmenu");
        }));
    }
    enter(prev) {
    }
    exit(next) {
    }
}
//# sourceMappingURL=credits.js.map