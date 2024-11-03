import { Render } from "../../../engine/render.js";
import { math } from "../../../engine/math/math.js";
import { IO } from "../../../engine/IO.js";
import WorldInstance from "../../../engine/sys-world/worldinstance.js";
import { GameState } from "../../../engine/gamestate.js";
import { GS_Gameplay } from "../gameplay.js";
import { Game } from "../../game.js";
export var RegionEvent;
(function (RegionEvent) {
    RegionEvent[RegionEvent["GEN_FINISHED"] = 1] = "GEN_FINISHED";
})(RegionEvent || (RegionEvent = {}));
export class GS_Region extends GameState {
    constructor() {
        super();
        this.worldData = null;
        this.img = null;
        this.first_entry = true;
        this.generated = false;
    }
    enter() {
        noSmooth();
        filter(OPAQUE);
        if (this.first_entry == true) {
            const [W, H] = Game.GlobalConfig["World"]["ChunkSize"];
            const scale = Game.GlobalConfig["World"]["ChunkScale"];
            this.worldData = new WorldInstance().generateWorld(0, 0, W, H, scale, -1212, 341);
            this.first_entry = false;
            console.log(`[${this.name}] Loaded world data`);
        }
        this.worldData.generateColliders(GS_Gameplay.groups.WORLD);
        // console.log(`[${this.name}] No. colliders: ${GS_Gameplay.groups.WORLD}`);
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
    }
    draw() {
        this.worldData.draw();
        super.draw();
    }
}
//# sourceMappingURL=state-region.js.map