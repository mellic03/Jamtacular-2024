import ui_Button from "../../../engine/ui/button.js";
import ui_List from "../../../engine/ui/list.js";
import ui_Title from "../../../engine/ui/title.js";
import Menu_SettingsAudio from "./audio.js";
import GameStateUI from "../gamestateui.js";
import Menu_SettingsGraphics from "./graphics.js";
export default class Menu_Settings extends GameStateUI {
    constructor(engine, name, parent = null) {
        super(engine, name, parent);
        parent.addChildState(new Menu_SettingsGraphics(engine, "settings-menu-graphics"));
        parent.addChildState(new Menu_SettingsAudio(engine, "settings-menu-audio"));
        this.ui_root = new ui_List(new ui_Title("Settings"), new ui_Button("Audio", () => {
            this.transition("settings-menu-audio");
        }), new ui_Button("Graphics", () => {
            this.transition("settings-menu-graphics");
        }), new ui_Button("System", () => {
            // this.transition("settings-menu-system");
        }), new ui_Button("Return", () => {
            this.transition("mainmenu");
        }));
    }
    enter(prev) {
    }
    exit(next) {
    }
}
//# sourceMappingURL=settings.js.map