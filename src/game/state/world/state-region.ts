import { Render } from "../../../engine/render.js";
import { math } from "../../../engine/math/math.js";
import { IO, KEYCODE } from "../../../engine/IO.js";
import WorldInstance from "../../../engine/sys-world/worldinstance.js";
import { GameState, GameStateFlag } from "../../../engine/gamestate.js";
import { GS_Gameplay } from "../gameplay.js";
import { Image } from "p5";
import { Game } from "../../game.js";
import vec2 from "../../../engine/math/vec2.js";



export enum RegionEvent
{
    GEN_FINISHED = 1
}



export class GS_Region extends GameState
{
    worldData: WorldInstance = null;
    img: Image = null;

    private first_entry = true;
    private generated = false;

    constructor()
    {
        super();
    
    }


    public enter(): void
    {
        noSmooth();
        filter(OPAQUE);

        if (this.first_entry == true)
        {
            const [W, H] = Game.GlobalConfig["World"]["ChunkSize"];
            const scale  = Game.GlobalConfig["World"]["ChunkScale"];
            this.worldData = new WorldInstance().generateWorld(0, 0, W, H, scale, -1212, 341);
            this.first_entry = false;

            console.log(`[${this.name}] Loaded world data`);
        }

        
        this.worldData.generateColliders(GS_Gameplay.groups.WORLD);
        // console.log(`[${this.name}] No. colliders: ${GS_Gameplay.groups.WORLD}`);
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
        super.update();

        if (IO.mouseWheel() != 0.0)
        {
            Render.scale -= 0.001 * IO.mouseWheel();
            Render.scale = math.clamp(Render.scale, 0.05, 2.0);
        }
        
    }


    public draw(): void
    {
        this.worldData.draw();
        super.draw();
    }

}
