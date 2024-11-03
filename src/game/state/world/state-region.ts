import { Render } from "../../../engine/render.js";
import { math } from "../../../engine/math/math.js";
import { IO, KEYCODE } from "../../../engine/IO.js";
import WorldInstance from "../../../engine/sys-world/worldinstance.js";
import { GameState, GameStateFlag } from "../../../engine/gamestate.js";
import { GS_Gameplay } from "../gameplay.js";
import { Image } from "p5";
import { Game } from "../../game.js";
import vec2 from "../../../engine/math/vec2.js";
import { iDefferedTask, WorkManager } from "../DefferredWork.js";
import WorldOptimiser, { DrawItem } from "../../../engine/sys-world/optimiser.js";



export enum RegionEvent
{
    GEN_FINISHED = 1
}




class ChunkColliderGen implements iDefferedTask
{
    taskid: number;

    finished: boolean = true;
    region:   WorldInstance;
    tmpgroup = new Group();
    visited  = new Set<DrawItem>();


    start:   number = 0;
    idx:     number = 0;
    xmin:    number = 0;
    xmax:    number = 0;
    ymin:    number = 0;
    ymax:    number = 0;
    xstep:   number = 0;
    ystep:   number = 1024;


    reset( region: WorldInstance, xmin: number, xmax: number, ymin: number, ymax: number )
    {
        this.region = region;
        this.visited.clear();

        this.start = frameCount;
        this.idx   = 0;
        this.xmin  = xmin;
        this.xmax  = xmax;
        this.ymin  = ymin;
        this.ymax  = ymax;
    }


    work(): boolean
    {
        if (this.ymin < this.ymax)
        {
            const tl = vec2.tmp(this.xmin, this.ymin);
            const br = vec2.tmp(this.xmax, this.ymin+this.ystep);
            this.ymin += this.ystep;
    
            this.region.generateColliders(this.tmpgroup, tl, br, this.visited);
            // this.region.generateColliders(GS_Gameplay.groups.WORLD, tl, br, this.visited);

            return false;
        }

        return true;
    }


    callback(): void
    {
        GS_Gameplay.groups.WORLD.removeAll();
        GS_Gameplay.groups.WORLD = this.tmpgroup;
        this.tmpgroup = new Group();

        console.log(`Task completed in ${frameCount - this.start} frames.`);
    }
}




export class GS_Region extends GameState
{
    worldData: WorldInstance = null;
    img: Image = null;

    private first_entry = true;
    private task        = new ChunkColliderGen();
    
    private prev_tl    = new vec2(0, 0);
    private prev_br    = new vec2(0, 0);
    private curr_cell  = new vec2(0, 0);
    private prev_cell  = new vec2(0, 0);


    constructor()
    {
        super();
    
    }


    public enter(): void
    {
        noSmooth();
        filter(OPAQUE);
    
        const [W, H] = Game.GlobalConfig["World"]["ChunkSize"];
        const S  = Game.GlobalConfig["World"]["ChunkScale"];

        if (this.first_entry == true)
        {
            this.worldData = new WorldInstance().generateWorld(0, 0, W, H, S, -1212, 341);
            this.first_entry = false;

            console.log(`[${this.name}] Loaded world data`);
        }

        const view = vec2.copy(Render.view);
        this.curr_cell.copy(view).divXY(S*W, S*H).floor();
        this.prev_cell.copy(view).addXY(99999);
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


        if (this.worldData.lookup == undefined)
        {
            this.worldData.lookup = WorldOptimiser.generateLookup(
                this.worldData.tl, this.worldData.br, this.worldData.scale, this.worldData.drawlist
            );
        }


        const [W, H] = Game.GlobalConfig["World"]["ChunkSize"];
        const S      = Game.GlobalConfig["World"]["ChunkScale"];
        const view   = vec2.copy(Render.view);
    
        const SPRITE_CHUNK_W = 2048;

        this.curr_cell.copy(view);

        const c0 = Math.abs(this.curr_cell.x - this.prev_cell.x) >= SPRITE_CHUNK_W/4;
        const c1 = Math.abs(this.curr_cell.y - this.prev_cell.y) >= SPRITE_CHUNK_W/4;

        if (this.task.finished == true && (c0 || c1))
        {
            const overshoot = 0.05;

            const delta = vec2.copy(this.curr_cell).sub(this.prev_cell);
                  delta.mulXY(overshoot);
                  delta.mulXY(0.0);

            const tl = vec2.copy(view).add(delta).subXY(SPRITE_CHUNK_W);
            const br = vec2.copy(view).add(delta).addXY(SPRITE_CHUNK_W);


            this.prev_cell.copy(this.curr_cell);
            this.prev_tl.copy(Render.tl);
            this.prev_br.copy(Render.br);

            
            this.task.reset(this.worldData, tl.x, br.x, tl.y, br.y);
            WorkManager.dispatch(this.task);
        }

    }


    public draw(): void
    {
        this.worldData.draw();
        super.draw();

        for (let S of GS_Gameplay.groups.WORLD)
        {
            rect(S.x-S.w/2, S.y-S.h/2, S.w, S.h);
        }
    }

}
