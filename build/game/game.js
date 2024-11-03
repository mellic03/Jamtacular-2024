import { Engine } from "../engine/engine.js";
import { StateManager } from "../engine/gamestate.js";
import { GS_UserInput, UserInputMsg } from "./state/userinput.js";
import { GS_Gameplay } from "./state/gameplay.js";
import { GS_GameUI } from "./state/ui.js";
import { GS_World } from "./state/world.js";
import sys_Audio from "../engine/sys-audio.js";
export const GameStateUserInput = new GS_UserInput();
export const GameStateGameplay = new GS_Gameplay();
export const GameStateWorld = new GS_World();
export const GameStateGameGUI = new GS_GameUI();
export class Game {
    constructor() {
        StateManager.addState(GameStateUserInput).makeActive();
        StateManager.addState(GameStateWorld).makeActive();
        StateManager.addState(GameStateGameplay).makeActive();
        StateManager.addState(GameStateGameGUI).makeActive();
    }
    preload() {
        Game.GlobalConfig = loadJSON("./assets/GlobalConfig.json");
        Game.LimbConfig = loadJSON("./assets/LimbConfig.json");
        Game.CharacterConfig = loadJSON("./assets/CharacterConfig.json");
        const audiosys = Engine.getSystem(sys_Audio);
        audiosys.load("assets/audio/click.wav");
    }
    setup() {
        GameStateUserInput.emit(UserInputMsg.PAUSE);
    }
    update() {
    }
}
//# sourceMappingURL=game.js.map