import Render from "../../../engine/sys-render.js";
import { math } from "../../../engine/math/math.js";
import { IO, KEYCODE } from "../../../engine/IO.js";
import WorldInstance from "../../../engine/sys-world/worldinstance.js";
import { GameState, GameStateFlag } from "../../../engine/gamestate.js";
import WorldOptimiser from "../../../engine/sys-world/optimiser.js";


export class GS_Region extends GameState
{
    worldData: WorldInstance = null;

    private first_entry = true;
    protected GROUP_WORLD:      Group;
    protected GROUP_ROPES:      Group;
    protected GROUP_CHARACTER:  Group;
    protected GROUP_PLAYER:     Group;
    protected GROUP_RAGE:       Group;
    protected GROUP_CALM:       Group;


    constructor()
    {
        super();
    }


    public enter(): void
    {
        if (this.first_entry == true)
        {
            this.worldData = new WorldInstance().generateWorld(0, 0, 128, 128, 32, 55, 341);
            console.log(`[${this.name}] Loaded world data`);

            this.GROUP_WORLD     = new Group();
            this.GROUP_ROPES     = new Group();
            this.GROUP_CHARACTER = new Group();
            this.GROUP_PLAYER    = new Group();
            this.GROUP_RAGE      = new Group();
            this.GROUP_CALM      = new Group();

            this.first_entry = false;
        }

        this.worldData.generateColliders(this.GROUP_WORLD);
        console.log(`[${this.name}] No. colliders: ${this.GROUP_WORLD.length}`);
    }


    public exit(): void
    {
        // this.setFlag(GameStateFlag.UPDATE, false);
        // this.setFlag(GameStateFlag.DRAW,   true);

        // this.updatables.length = 0;
        // this.renderables.length = 0;

        for (let B of this.GROUP_WORLD)
        {
            B.remove();
        }

        this.GROUP_WORLD.removeAll();
        this.GROUP_ROPES.removeAll();
        this.GROUP_CHARACTER.removeAll();
        this.GROUP_PLAYER.removeAll();
        this.GROUP_RAGE.removeAll();
        this.GROUP_CALM.removeAll();
    }


    public update(): void
    {
        if (this.worldData.isReady() == false)
        {
            return;
        }

        super.update();

        // for (let obj of this.updatables)
        // {
        //     obj.update();
        // }

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
