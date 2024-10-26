import { EventFlag } from "../../engine/engine.js";
import GameState from "../../engine/gamestate/gamestate.js";
import ui_Bounds from "../../engine/ui/bounds.js";
class GameStateUI extends GameState {
    constructor(engine, name, parent = null) {
        if (GameStateUI.first) {
            engine.event.on(EventFlag.UPDATE, () => {
                GameStateUI.canTransition = true;
            });
            GameStateUI.first = false;
        }
        super(engine, name, parent);
    }
    transition(to) {
        if (GameStateUI.canTransition == true) {
            super.transition(to);
            GameStateUI.canTransition = false;
        }
    }
    enter(prev) {
    }
    exit(next) {
    }
    update() {
        super.update();
        this.ui_root.update(new ui_Bounds(0, 1024, 0, 1024));
    }
    draw(ren) {
        translate(-ren.xoffset, -ren.yoffset, +5);
        this.ui_root.draw(ren, 0);
        translate(+ren.xoffset, +ren.yoffset, -5);
    }
}
GameStateUI.first = true;
GameStateUI.canTransition = true;
GameStateUI.sound_click = null;
export default GameStateUI;
//# sourceMappingURL=gamestateui.js.map