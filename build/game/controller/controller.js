import { Game } from "../game.js";
export class CharacterController {
    constructor() {
        this.is_good = false;
        if (CharacterController._first_instance == true) {
            const tickrate = Game.GlobalConfig["CharacterControllerTickRate"];
            CharacterController._tickrate = 1.0 / tickrate;
            CharacterController._first_instance = false;
            CharacterController._controllers = new Array();
        }
        CharacterController._controllers.push(this);
    }
    static updateAll() {
        CharacterController._timer += (deltaTime / 1000.0);
        if (CharacterController._timer >= CharacterController._tickrate) {
            for (let ctl of CharacterController._controllers) {
                ctl.is_good = true;
            }
            CharacterController._timer = 0;
        }
        else {
            for (let ctl of CharacterController._controllers) {
                ctl.is_good = false;
            }
        }
    }
    update(C) { }
    ;
}
CharacterController._first_instance = true;
CharacterController._timer = 0;
CharacterController._tickrate = 1.0 / 60.0;
//# sourceMappingURL=controller.js.map