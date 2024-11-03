import { GameState, GameStateFlag } from "../../../engine/gamestate.js";
import { GS_Region1 } from "./state-region1.js";
import { GS_Region2 } from "./state-region2.js";
import { GS_Region3 } from "./state-region3.js";
import { UserInputMsg } from "../userinput.js";
import { GameStateUserInput } from "../../game.js";
export class GS_World extends GameState {
    preload() {
    }
    setup() {
        super.setup();
        noiseSeed(1831);
        this.addSubstate(new GS_Region1);
        this.addSubstate(new GS_Region2);
        this.addSubstate(new GS_Region3);
        this.pushState(GS_Region1);
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
        const region = this.topState();
        if (region != null && region.worldData.isReady()) {
            GS_World.raycast = (x, y, dx, dy) => { return region.worldData.raycast(x, y, dx, dy); };
        }
    }
    draw() {
        super.draw();
    }
    transition(to) {
        const state = this.getState(to);
        if (state == undefined) {
            console.assert(false, "You fucking dipshit");
            return;
        }
        super.transition(to);
    }
}
GS_World.raycast = (x, y, dx, dy) => { return false; };
//# sourceMappingURL=world.js.map