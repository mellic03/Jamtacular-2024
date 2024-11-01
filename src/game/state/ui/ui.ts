import { idk_Stack } from "../../../engine/ds/idk_stack.js";
import { StateManager, GameState } from "../../../engine/gamestate.js";
import Render from "../../../engine/sys-render.js";
import ui_ElementBase from "../../../engine/ui/base.js";
import ui_Bounds from "../../../engine/ui/bounds.js";
import ui_Button from "../../../engine/ui/button.js";
import ui_Grid from "../../../engine/ui/grid.js";
import ui_List from "../../../engine/ui/list.js";
import ui_Title from "../../../engine/ui/title.js";
import { GS_Gameplay } from "../gameplay/gameplay.js";
import { GS_Region1 } from "../world/state-region1.js";
import { GS_Region2 } from "../world/state-region2.js";
import { GS_Region3 } from "../world/state-region3.js";
import { GS_Editor, GS_EditorTest } from "../../editor/editor.js";
import { GS_MainMenuGUI } from "./ui-mainmenu.js";
import { GS_World } from "../world/world.js";
import { GameStateGameplay, GameStateUserInput, GameStateWorld } from "../../game.js";
import { UserInputMsg } from "../userinput.js";
import { GS_InGameGUI } from "./ui-ingame.js";


const pushState  = (A, B) => { StateManager.getState(A).pushState(B);  };
const popState   = (A   ) => { StateManager.getState(A).popState();    };
const transition = (A, B) => { StateManager.getState(A).transition(B); };


export class GS_GameUI extends GameState
{
    constructor()
    {
        super();


    }

    public setup(): void
    {
        super.setup();
    
        this.addSubstate(new GS_InGameGUI);
        this.addSubstate(new GS_MainMenuGUI);

        GameStateUserInput.on(UserInputMsg.PAUSE, () => {
            this.transition(GS_MainMenuGUI);
        });
    
        GameStateUserInput.on(UserInputMsg.UNPAUSE, () => {
            this.transition(GS_InGameGUI);
        });
    }


    update(): void
    {
        super.update();
    }


    private diagnostics(): void
    {
        stroke(255);
        fill(255);
        textSize(24);
        strokeWeight(1);
        textAlign(RIGHT, CENTER);

        Render.screenText(`fps: ${Render.avgFPS().toPrecision(4)}`, Render.width-25, 25);


        textAlign(LEFT, CENTER);
        const S0 = GameStateGameplay.stack.data;
        const S1 = GameStateWorld.stack.data;


        Render.screenText(`GS_Gameplay.stack`, 0.85*Render.width, 3*Render.height/4 - 64*S0.length);
        for (let i=S0.length-1; i>=0; i--)
            Render.screenText(`${i}\t\t\t${S0[i].name}`, 0.85*Render.width, 3*Render.height/4 - 64*i);

        Render.screenText(`GS_World.stack`, 0.7*Render.width, 3*Render.height/4 - 64*S1.length);
        for (let i=S1.length-1; i>=0; i--)
            Render.screenText(`${i}\t\t\t${S1[i].name}`, 0.7*Render.width, 3*Render.height/4 - 64*i);


        textAlign(CENTER, TOP);

        if (this.topState())
        {
            const txt = `GS_Gameplay.state: ${this.topState().name}`;
            Render.screenText(txt, Render.width/2, Render.height-100);
        }
    }


    draw(): void
    {
        super.draw();

        this.diagnostics();
    }

}
