import { Render } from "../../../engine/render.js";
import { math } from "../../../engine/math/math.js";
import { IO } from "../../../engine/IO.js";
import WorldInstance from "../../../engine/sys-world/worldinstance.js";
import { GameState } from "../../../engine/gamestate.js";
import { GS_Gameplay } from "../gameplay.js";
import { Game } from "../../game.js";
import vec2 from "../../../engine/math/vec2.js";
import { WorkManager } from "../DefferredWork.js";
import WorldOptimiser from "../../../engine/sys-world/optimiser.js";
export var RegionEvent;
(function (RegionEvent) {
    RegionEvent[RegionEvent["GEN_FINISHED"] = 1] = "GEN_FINISHED";
})(RegionEvent || (RegionEvent = {}));
class ChunkColliderGen {
    constructor() {
        this.finished = true;
        this.tmpgroup = new Group();
        this.visited = new Set();
        this.start = 0;
        this.idx = 0;
        this.xmin = 0;
        this.xmax = 0;
        this.ymin = 0;
        this.ymax = 0;
        this.xstep = 0;
        this.ystep = 256;
    }
    reset(region, xmin, xmax, ymin, ymax) {
        this.region = region;
        this.visited.clear();
        this.start = frameCount;
        this.idx = 0;
        this.xmin = xmin;
        this.xmax = xmax;
        this.ymin = ymin;
        this.ymax = ymax;
    }
    work() {
        if (this.ymin < this.ymax) {
            const tl = vec2.tmp(this.xmin, this.ymin);
            const br = vec2.tmp(this.xmax, this.ymin + this.ystep);
            this.ymin += this.ystep;
            this.region.generateColliders(this.tmpgroup, tl, br, this.visited);
            // this.region.generateColliders(GS_Gameplay.groups.WORLD, tl, br, this.visited);
            return false;
        }
        return true;
    }
    callback() {
        GS_Gameplay.groups.WORLD.removeAll();
        GS_Gameplay.groups.WORLD = this.tmpgroup;
        this.tmpgroup = new Group();
        console.log(`Task completed in ${frameCount - this.start} frames.`);
    }
}
export class GS_Region extends GameState {
    constructor() {
        super();
        this.worldData = null;
        this.img = null;
        this.first_entry = true;
        this.task = new ChunkColliderGen();
        this.prev_tl = new vec2(0, 0);
        this.prev_br = new vec2(0, 0);
        this.curr_cell = new vec2(0, 0);
        this.prev_cell = new vec2(0, 0);
    }
    enter() {
        noSmooth();
        filter(OPAQUE);
        const [W, H] = Game.GlobalConfig["World"]["ChunkSize"];
        const S = Game.GlobalConfig["World"]["ChunkScale"];
        const view = vec2.copy(Render.view);
        if (this.first_entry == true) {
            this.worldData = new WorldInstance().generateWorld(0, 0, W, H, S, -1212, 341);
            this.first_entry = false;
            this.task.reset(this.worldData, view.x - 2048, view.x + 2048, view.y - 2048, view.y + 2048);
            WorkManager.dispatch(this.task);
            console.log(`[${this.name}] Loaded world data`);
        }
        this.curr_cell.copy(view).divXY(S * W, S * H).floor();
        this.prev_cell.copy(view).addXY(0);
    }
    exit() {
        for (let B of GS_Gameplay.groups.WORLD) {
            B.remove();
        }
        GS_Gameplay.groups.WORLD.removeAll();
    }
    update() {
        super.update();
        if (IO.mouseWheel() != 0.0) {
            Render.scale -= 0.001 * IO.mouseWheel();
            Render.scale = math.clamp(Render.scale, 0.05, 2.0);
        }
        if (this.worldData.lookup == undefined) {
            this.worldData.lookup = WorldOptimiser.generateLookup(this.worldData.tl, this.worldData.br, this.worldData.scale, this.worldData.drawlist);
        }
        const [W, H] = Game.GlobalConfig["World"]["ChunkSize"];
        const S = Game.GlobalConfig["World"]["ChunkScale"];
        const view = vec2.copy(Render.view);
        const SPRITE_CHUNK_W = 2048;
        this.curr_cell.copy(view);
        const c0 = Math.abs(this.curr_cell.x - this.prev_cell.x) >= SPRITE_CHUNK_W / 4;
        const c1 = Math.abs(this.curr_cell.y - this.prev_cell.y) >= SPRITE_CHUNK_W / 4;
        if (this.task.finished == true && (c0 || c1)) {
            const overshoot = 1.75;
            const delta = vec2.copy(this.curr_cell).sub(this.prev_cell);
            delta.mulXY(overshoot);
            //   delta.mulXY(0.0);
            const tl = vec2.copy(view).add(delta).subXY(SPRITE_CHUNK_W);
            const br = vec2.copy(view).add(delta).addXY(SPRITE_CHUNK_W);
            br.x = math.clamp(br.x, this.worldData.tl.x, this.worldData.br.x);
            br.y = math.clamp(br.y, this.worldData.tl.y, this.worldData.br.y);
            tl.x = math.clamp(tl.x, this.worldData.tl.x, this.worldData.br.x);
            tl.y = math.clamp(tl.y, this.worldData.tl.y, this.worldData.br.y);
            this.prev_cell.copy(this.curr_cell);
            this.prev_tl.copy(Render.tl);
            this.prev_br.copy(Render.br);
            this.task.reset(this.worldData, tl.x, br.x, tl.y, br.y);
            WorkManager.dispatch(this.task);
        }
    }
    draw() {
        this.worldData.draw();
        super.draw();
        // for (let S of GS_Gameplay.groups.WORLD)
        // {
        //     rect(S.x-S.w/2, S.y-S.h/2, S.w, S.h);
        // }
    }
}
//# sourceMappingURL=state-region.js.map