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
        this.paused = true;
    }
    update() {
        super.update();
        this.on(UserInputMsg.PAUSE, () => {
            console.log("PAUSE");
            this.paused = true;
        });
        this.on(UserInputMsg.UNPAUSE, () => {
            console.log("UNPAUSE");
            this.paused = false;
        });
        if (IO.keyTapped(KEYCODE.ESC)) {
            const P = this.paused;
            if (P)
                this.emit(UserInputMsg.UNPAUSE);
            else
                this.emit(UserInputMsg.PAUSE);
        }
    }
    draw() {
        super.draw();
    }
}
//# sourceMappingURL=userinput.js.map