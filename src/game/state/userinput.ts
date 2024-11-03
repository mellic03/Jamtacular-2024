import { GameState } from "../../engine/gamestate.js";
import { IO, KEYCODE } from "../../engine/IO.js";
import { EventEmitter } from "../../engine/sys-event.js";
import { GameStateGameplay, GameStateGameGUI } from "../game.js";



export enum UserInputMsg
{
    PAUSE,
    UNPAUSE,
};



export class GS_UserInput extends GameState<UserInputMsg>
{
    paused: boolean = true;

    constructor()
    {
        super();
    }


    update(): void
    {
        super.update();

        this.on(UserInputMsg.PAUSE, () => {
            console.log("PAUSE")
            this.paused = true;
        });

        this.on(UserInputMsg.UNPAUSE, () => {
            console.log("UNPAUSE")
            this.paused = false;
        });

        if (IO.keyTapped(KEYCODE.ESC))
        {
            const P = this.paused;

            if (P)  this.emit(UserInputMsg.UNPAUSE);
            else    this.emit(UserInputMsg.PAUSE);
        }

    }


    draw(): void
    {
        super.draw();

    }

}
