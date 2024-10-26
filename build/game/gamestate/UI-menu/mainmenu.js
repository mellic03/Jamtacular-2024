import ui_Button from "../../../engine/ui/button.js";
import ui_List from "../../../engine/ui/list.js";
import GameStateUI from "../gamestateui.js";
import Menu_Settings from "./settings.js";
import Menu_Credits from "./credits.js";
import ui_Title from "../../../engine/ui/title.js";
export default class StateMainMenu extends GameStateUI {
    constructor(engine, name, parent = null) {
        super(engine, name, parent);
        parent.addChildState(new Menu_Settings(engine, "settings-menu", parent));
        parent.addChildState(new Menu_Credits(engine, "credits-menu", parent));
        this.ui_root = new ui_List(new ui_Title("Paused"), new ui_Button("Continue", () => {
            this.transition("gameui");
        }), new ui_Button("Settings", () => {
            this.transition("settings-menu");
        }), new ui_Button("Credits", () => {
            this.transition("credits-menu");
        }));
    }
    enter(prev) {
    }
    exit(next) {
    }
}
//# sourceMappingURL=mainmenu.js.map