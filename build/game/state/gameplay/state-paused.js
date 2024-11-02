import { GameState } from "../../../engine/gamestate.js";
export class GS_Dummy extends GameState {
    enter() { }
    exit() { }
    update() { }
    draw() { }
}
export class GS_Paused extends GameState {
    enter() {
        world.timeScale = 0;
    }
    exit() {
        world.timeScale = 1;
    }
    update() {
    }
    draw() {
    }
}
//# sourceMappingURL=state-paused.js.map