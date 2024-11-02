import { GameState, GameStateFlag } from "../../../engine/gamestate.js";
import Render from "../../../engine/sys-render.js";
import ui_Bounds from "../../../engine/ui/bounds.js";
import ui_Button from "../../../engine/ui/button.js";
import ui_Grid from "../../../engine/ui/grid.js";
// import ui_Slider from "../../../engine/ui/slider.js";
import { setSyleSpanLimitAsPixels } from "../../../engine/ui/style.js";
import { GameStateGameGUI, GameStateGameplay, GameStateUserInput, GameStateWorld } from "../../game.js";
import { UserInputMsg } from "../userinput.js";
class ui_HUDdummy extends ui_Button {
    constructor() {
        super("X");
        setSyleSpanLimitAsPixels(this.style, 4, 9999, 4, 9999);
        this.updateStyle();
    }
}
class ui_HUD extends ui_Grid {
}
export class GS_InGameGUI extends GameState {
    constructor() {
        super();
        this.renbounds = new ui_Bounds(0, 0, 1, 1);
        // this.ui = new ui_Grid(3, 3,
        //     new ui_Button("A"), new ui_Button("B"), new ui_Button("C"),
        //     new ui_Button("X"), new ui_Button("Y"), new ui_Button("Z"),
        //     new ui_Button("1"), new ui_Button("2"), new ui_Button("3")
        // );
        this.ui = new ui_HUD(4, 6);
        GameStateUserInput.on(UserInputMsg.PAUSE, () => {
            this.setFlag(GameStateFlag.UPDATE, false);
            this.setFlag(GameStateFlag.DRAW, true);
        });
        GameStateUserInput.on(UserInputMsg.UNPAUSE, () => {
            this.setFlag(GameStateFlag.UPDATE, true);
            this.setFlag(GameStateFlag.DRAW, true);
        });
    }
    update() {
        super.update();
        this.renbounds.fromMinMax(0, Render.width, 0, Render.height);
        this.ui.update(this.renbounds);
    }
    diagnostics() {
        stroke(255);
        fill(255);
        textSize(24);
        strokeWeight(1);
        textAlign(RIGHT, CENTER);
        Render.screenText(`fps: ${Render.avgFPS().toPrecision(4)}`, Render.width - 25, 25);
        textAlign(LEFT, CENTER);
        const S0 = GameStateGameplay.stack.data;
        const S1 = GameStateWorld.stack.data;
        const S2 = GameStateGameGUI.stack.data;
        Render.screenText(`GS_Gameplay.stack`, 0.85 * Render.width, 3 * Render.height / 4 - 64 * S0.length);
        for (let i = S0.length - 1; i >= 0; i--)
            Render.screenText(`${i}\t\t\t${S0[i].name}`, 0.85 * Render.width, 3 * Render.height / 4 - 64 * i);
        Render.screenText(`GS_World.stack`, 0.7 * Render.width, 3 * Render.height / 4 - 64 * S1.length);
        for (let i = S1.length - 1; i >= 0; i--)
            Render.screenText(`${i}\t\t\t${S1[i].name}`, 0.7 * Render.width, 3 * Render.height / 4 - 64 * i);
        Render.screenText(`GS_World.stack`, 0.55 * Render.width, 3 * Render.height / 4 - 64 * S2.length);
        for (let i = S2.length - 1; i >= 0; i--)
            Render.screenText(`${i}\t\t\t${S2[i].name}`, 0.55 * Render.width, 3 * Render.height / 4 - 64 * i);
        textAlign(CENTER, TOP);
        if (this.topState()) {
            const txt = `GS_Gameplay.state: ${this.topState().name}`;
            Render.screenText(txt, Render.width / 2, Render.height - 100);
        }
    }
    draw() {
        super.draw();
        Render.pushInverseViewTransform();
        this.ui.draw();
        Render.popInverseViewTransform();
        this.diagnostics();
    }
}
//# sourceMappingURL=ui-ingame.js.map