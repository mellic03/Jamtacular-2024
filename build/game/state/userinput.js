import { GameState } from "../../engine/gamestate.js";
import { IO, KEYCODE } from "../../engine/IO.js";
export var UserInputMsg;
(function (UserInputMsg) {
    UserInputMsg[UserInputMsg["PAUSE"] = 0] = "PAUSE";
    UserInputMsg[UserInputMsg["UNPAUSE"] = 1] = "UNPAUSE";
})(UserInputMsg || (UserInputMsg = {}));
;
export class GS_UserInput extends GameState {
    constructor() {
        super();
        this.paused = false;
        IO.onKeyPress(KEYCODE.ESC, (event) => {
            const P = this.paused;
            this.paused = !this.paused;
            if (P)
                this.emit(UserInputMsg.PAUSE);
            else
                this.emit(UserInputMsg.UNPAUSE);
        });
    }
    update() {
        super.update();
    }
    draw() {
        super.draw();
    }
}
//# sourceMappingURL=userinput.js.map