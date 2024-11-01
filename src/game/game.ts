import { __engine } from "../engine/engine.js";
import { StateManager } from "../engine/gamestate.js";
import { GS_UserInput } from "./state/userinput.js";
import { GS_Gameplay } from "./state/gameplay/gameplay.js";
import { GS_GameUI } from "./state/ui/ui.js";
import { GS_World } from "./state/world/world.js";



export const GameStateUserInput = new GS_UserInput();
export const GameStateGameplay  = new GS_Gameplay();
export const GameStateWorld     = new GS_World();
export const GameStateGameGUI   = new GS_GameUI();


export class Game
{
    constructor()
    {
        StateManager.addState(GameStateUserInput).makeActive();
        StateManager.addState(GameStateGameplay).makeActive();
        StateManager.addState(GameStateWorld).makeActive();
        StateManager.addState(GameStateGameGUI).makeActive();
    }
}


// class RootState extends GameState
// {
//     constructor()
//     {
//         super();

//         const gameplay = new GS_Gameplay();
//         const mainmenu = new GS_GameUI();
//         const editor   = new GS_Editor();

//         StateManager.addState(this.makeActive());
//         // this.addSubstate(gameplay.makeActive());
//         // this.addSubstate(editor);
//         // this.addSubstate(mainmenu.makeActive());

//         // this.pushState(GS_MainMenu);
//         StateManager.addState(gameplay.makeActive());
//         StateManager.addState(editor.makeActive());
//         StateManager.addState(mainmenu.makeActive());

//         gameplay.on("pause",   () => { mainmenu.makeActive();   });
//         gameplay.on("unpause", () => { mainmenu.makeInactive(); });
//     }


//     public preload(): void
//     {
//         super.preload();
//         const imgsys = __engine.getSystem(sys_Image);
//         imgsys.load("assets/img/meat.jpg");
//         imgsys.load("assets/img/michael.png");
//         imgsys.load("assets/img/heart-red.png");
//         imgsys.load("assets/img/rope.png");
//     }


//     public setup(): void
//     {
//         super.setup();
//         angleMode(RADIANS);

//     }


//     public update(): void
//     {
//         super.update();
//         // player.update();
//         // thing.update();

//         // const gameplay = StateManager.getState(GS_Gameplay);
//         // const mainmenu = StateManager.getState(GS_MainMenu);

//         // if (gameplay.isActive() == true && IO.ke)

//     }


//     public draw(): void
//     {
//         super.draw();

//         // const state = this.currentState();
    
//         // if (state)
//         // {
//         //     state.draw();
//         // }
//     }

// }

