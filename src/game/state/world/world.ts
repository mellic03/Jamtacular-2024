
import { GameState, GameStateFlag } from "../../../engine/gamestate.js";
import { GS_Region } from "./state-region.js";
import { GS_Region1 } from "./state-region1.js";
import { GS_Region2 } from "./state-region2.js";
import { GS_Region3 } from "./state-region3.js";
import { GameStateUserInput } from "../../game.js";
import { UserInputMsg } from "../userinput.js";



export class GS_World extends GameState
{
    static raycast = (x, y, dx, dy)  => { return false };

    public preload(): void
    {
        
    }

    public setup(): void
    {
        super.setup();
    
        noiseSeed(1831);

        this.addSubstate(new GS_Region1);
        this.addSubstate(new GS_Region2);
        this.addSubstate(new GS_Region3);
        this.pushState(GS_Region1);

        GameStateUserInput.on(UserInputMsg.PAUSE, () => {
            this.setFlag(GameStateFlag.UPDATE, false);
            this.setFlag(GameStateFlag.DRAW,   true);
        });

        GameStateUserInput.on(UserInputMsg.UNPAUSE, () => {
            this.setFlag(GameStateFlag.UPDATE, true);
            this.setFlag(GameStateFlag.DRAW,   true);
        });

    }


    public update(): void
    {
        super.update();

        const region = (this.topState() as GS_Region);

        if (region != null && region.worldData.isReady())
        {
            GS_World.raycast = (x, y, dx, dy) => { return region.worldData.raycast(x, y, dx, dy); };
        }
    }


    public draw(): void
    {
        super.draw();
    }


    public transition<T extends GameState>( to: { new(): T } ): void
    {
        const state = this.getState(to);

        if ((state as GS_Region) == undefined)
        {
            console.assert(false, "You fucking dipshit");
            return;
        } 

        super.transition(to);
    }
}

