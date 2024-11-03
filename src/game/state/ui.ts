import { StateManager, GameState, GameStateFlag } from "../../engine/gamestate.js";
import Render from "../../engine/sys-render.js";
import { GS_MainMenuGUI } from "./ui/ui-mainmenu.js";
import { Game, GameStateGameplay, GameStateUserInput, GameStateWorld } from "../game.js";
import { UserInputMsg } from "./userinput.js";
import { GS_InGameGUI } from "./ui/ui-ingame.js";
import { GS_SettingsGUI } from "./ui/ui-settings.js";


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
        this.addSubstate(new GS_SettingsGUI);
        this.transition(GS_MainMenuGUI);

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
