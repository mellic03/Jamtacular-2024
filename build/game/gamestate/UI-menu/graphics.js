import ui_Button from "../../../engine/ui/button.js";
import ui_List from "../../../engine/ui/list.js";
import ui_Title from "../../../engine/ui/title.js";
import GameStateUI from "../gamestateui.js";
export default class Menu_SettingsGraphics extends GameStateUI {
    constructor(engine, name, parent = null) {
        super(engine, name, parent);
        this.ui_root = new ui_List(new ui_Title("Graphics"), new ui_Button("Resolution", () => {
            // engine.transitionGameState("settings-menu", "settings-menu-audio");
        }), new ui_Button("Quality", () => {
            // engine.transitionGameState("settings-menu", "settings-menu-graphics");
        }), new ui_Button("AA", () => {
            // engine.transitionGameState("settings-menu", "settings-menu-system");
        }), new ui_Button("Return", () => {
            this.transition("settings-menu");
        }));
    }
    enter(prev) {
    }
    exit(next) {
    }
}
//# sourceMappingURL=graphics.js.map