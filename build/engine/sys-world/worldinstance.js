import vec2 from "../math/vec2.js";
import WorldOptimiser from "./optimiser.js";
import WorldGenerator from "./generator.js";
import WorldQuery, { WorldQueryResult } from "./query.js";
import Render from "../sys-render.js";
import StaticBody from "../physics/staticbody.js";
export default class WorldInstance {
    constructor() {
        this.img_mode = false;
        this.img_loaded = false;
    }
    init(x = 0, y = 0, width = 128, height = 128, scale = 32) {
        this.corner = new vec2(x, y).subXY(0.5 * scale * width, 0.5 * scale * height);
        this.width = width;
        this.height = height;
        this.scale = scale;
    }
    generateWorld(x = 0, y = 0, w = 128, h = 128, scale = 32, xoff = 2048, yoff = 1024) {
        this.init(x, y, w, h, scale);
        this.data = WorldGenerator.generateWorld(this.width, this.height, this.scale, xoff, yoff);
        this.drawlist = WorldOptimiser.generateDrawlist(this.data);
        return this;
    }
    loadWorld(filepath, x = 0, y = 0, w = 128, h = 128, scale = 32) {
        this.init(x, y, w, h, scale);
        this.img_mode = true;
        this.img_loaded = false;
        this.img = loadImage(filepath, () => {
            this.img_loaded = true;
        });
        return this;
    }
    generateColliders(cringe) {
        for (let block of this.drawlist) {
            const x = this.scale * block.col + this.corner.x;
            const y = this.scale * block.row + this.corner.y;
            const w = this.scale * block.w;
            cringe.add((new StaticBody(x, y, w)).sprite);
        }
    }
    worldToCell(world) {
        return vec2.copy(world).sub(this.corner).divXY(this.scale);
    }
    cellToWorld(cell) {
        return vec2.copy(cell).mulXY(this.scale).add(this.corner);
    }
    inBounds(row, col) {
        return (row < 0) || (row >= this.data.length) || (col < 0) || (col >= this.data[0].length);
    }
    raycast(ox, oy, dx, dy) {
        const origin = this.worldToCell(vec2.tmp(ox, oy));
        const dir = vec2.tmp(dx, dy).normalize();
        if (WorldQuery.raycast(this.data, origin, dir)) {
            const cell = vec2.copy(WorldQueryResult.hit);
            const world = this.cellToWorld(cell);
            WorldQueryResult.hit.copy(world);
            return true;
        }
        return false;
    }
    isReady() {
        if (this.img_mode == false) {
            return true;
        }
        if (this.img_loaded == true) {
            this.data = WorldGenerator.loadWorld(this.width, this.height, this.img);
            this.drawlist = WorldOptimiser.generateDrawlist(this.data);
            return true;
        }
        return false;
    }
    preload() {
    }
    setup() {
    }
    draw() {
        rectMode(CORNER);
        noStroke();
        // stroke(255);
        // noFill();
        fill(50);
        for (let block of this.drawlist) {
            const x = this.scale * block.col + this.corner.x;
            const y = this.scale * block.row + this.corner.y;
            const w = this.scale * block.w;
            Render.rectCornerXY(x, y, w, w);
        }
    }
}
//# sourceMappingURL=worldinstance.js.map