import { GameState } from "../../engine/gamestate.js";
import { IO, KEYCODE } from "../../engine/IO.js";
import { GameStateGameplay, GameStateGameGUI } from "../game.js";



export enum UserInputMsg
{
    PAUSE,
    UNPAUSE,
};


export class GS_UserInput extends GameState<UserInputMsg>
{
    private paused = false;

    constructor()
    {
        super();

        IO.onKeyPress(KEYCODE.ESC, (event: KeyboardEvent) => {

            const P = this.paused;
            this.paused = !this.paused;

            if (P) this.emit(UserInputMsg.PAUSE);
            else   this.emit(UserInputMsg.UNPAUSE);
        });
    }


    update(): void
    {
        super.update();


    }


    draw(): void
    {
        super.draw();

    }

}
