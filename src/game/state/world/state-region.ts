import Render from "../../../engine/sys-render.js";
import { math } from "../../../engine/math/math.js";
import { IO, KEYCODE } from "../../../engine/IO.js";
import WorldInstance from "../../../engine/sys-world/worldinstance.js";
import { GameState, GameStateFlag } from "../../../engine/gamestate.js";
import WorldOptimiser from "../../../engine/sys-world/optimiser.js";
import { GS_World } from "../world.js";
import { GS_Gameplay } from "../gameplay.js";


export class GS_Region extends GameState
{
    worldData: WorldInstance = null;

    private first_entry = true;
    // protected GROUP_WORLD:      Group;
    // protected GROUP_ROPES:      Group;
    // protected GROUP_CHARACTER:  Group;
    // protected GROUP_PLAYER:     Group;
    // protected GROUP_RAGE:       Group;
    // protected GROUP_CALM:       Group;


    constructor()
    {
        super();
    }


    public enter(): void
    {
        if (this.first_entry == true)
        {
            this.worldData = new WorldInstance().generateWorld(0, 0, 128, 128, 64, -1212, 341);
            console.log(`[${this.name}] Loaded world data`);
            this.first_entry = false;
        }

        this.worldData.generateColliders(GS_Gameplay.groups.WORLD);
        console.log(`[${this.name}] No. colliders: ${GS_Gameplay.groups.WORLD}`);
    }


    public exit(): void
    {
        for (let B of GS_Gameplay.groups.WORLD)
        {
            B.remove();
        }

        GS_Gameplay.groups.WORLD.removeAll();
    }


    public update(): void
    {
        if (this.worldData.isReady() == false)
        {
            return;
        }

        super.update();


        if (IO.mouseWheel() != 0.0)
        {
            Render.scale -= 0.001 * IO.mouseWheel();
            Render.scale = math.clamp(Render.scale, 0.05, 2.0);
        }
        
    }


    public draw(): void
    {
        if (this.worldData.isReady() == false)
        {
            return;
        }

        this.worldData.draw();
        super.draw();

        // for (let obj of this.renderables)
        // {
        //     obj.draw();
        // }

    }

}
