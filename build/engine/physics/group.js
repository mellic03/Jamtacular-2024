import { Engine } from "../engine.js";
import { math } from "../math/math.js";
import vec2 from "../math/vec2.js";
import { Render } from "../render.js";
import { PHYS_TIMESTEP } from "./physics.js";
const LOWRES_CELL_W = 512;
const LOWRES_CELL_HW = LOWRES_CELL_W / 2;
const GRID_DEGREE = 128;
export default class BasedCollisionGroup {
    constructor(x, y, centered = true) {
        this.accum = 0;
        this.prev_count = 0;
        this.corner = new vec2(x, y);
        this.span = new vec2(LOWRES_CELL_W, LOWRES_CELL_W);
        if (centered) {
            this.corner.subXY(LOWRES_CELL_HW * GRID_DEGREE);
        }
        this.rigidbodies = [];
        this.staticbodies = [];
        this.grid = [];
        this.visited = new Set();
        this.collides_with = [];
        for (let i = 0; i < GRID_DEGREE; i++) {
            this.grid.push([]);
            for (let j = 0; j < GRID_DEGREE; j++) {
                this.grid[i].push([]);
            }
        }
    }
    collideWith(group) {
        this.collides_with.push(group);
    }
    worldToCell(world) {
        return vec2.copy(world).sub(this.corner).div(this.span).floor();
    }
    cellToWorld(cell) {
        return vec2.copy(cell).mul(this.span).add(this.corner);
    }
    addBody(body) {
        this.rigidbodies.push(body);
    }
    addStaticBody(body) {
        this.staticbodies.push(body);
    }
    _tunneled(pos, vel) {
        return false;
    }
    _resolve_tunnel(rbody) {
        const MAX_RESOLVE = 8;
        let count = 0;
        const disp = vec2.copy(rbody.vprev);
        for (let i = 0; i < MAX_RESOLVE; i++) {
            if (this._tunneled(rbody.curr, disp) == false) {
                break;
            }
            disp.mulXY(0.5);
            rbody.curr.subMul(disp, 1);
            count += 1;
        }
    }
    _collides(rbody, sbody, P, N) {
        const r = rbody.radius;
        const rSQ = r * r;
        const minv = vec2.tmp().copy(sbody.tl);
        const maxv = vec2.tmp().copy(sbody.br);
        const x = math.clamp(rbody.curr.x, minv.x, maxv.x);
        const y = math.clamp(rbody.curr.y, minv.y, maxv.y);
        P.setXY(x, y);
        if (P.distSq(rbody.curr) <= rSQ) {
            const dx = rbody.curr.x - sbody.center.x;
            const dy = rbody.curr.y - sbody.center.y;
            if (Math.abs(dx) > Math.abs(dy)) {
                N.setXY(Math.sign(dx), 0).normalize();
            }
            else {
                N.setXY(0, Math.sign(dy)).normalize();
            }
            return true;
        }
        return false;
    }
    _resolve(rbody, sbody, P, N) {
        const dir = vec2.tmp().displacement(P, rbody.curr);
        if (dir.magSq() < 0.0001) {
            return;
        }
        const overlap = rbody.radius - rbody.curr.dist(P);
        dir.normalize().mulXY(overlap).mulXY(1);
        rbody.curr.add(dir);
        // rbody.friction_time = rbody.friction;
        // circle(P.x, P.y, 20);
    }
    _solve_rbody(rbody, row, col) {
        const P = vec2.tmp();
        const N = vec2.tmp();
        for (let group of this.collides_with) {
            for (let sbody of group.grid[row][col]) {
                this._resolve_tunnel(rbody);
                if (this._collides(rbody, sbody, P, N)) {
                    // circle(rbody.curr.x, rbody.curr.y, 25);
                    this._resolve(rbody, sbody, P, N);
                }
            }
        }
    }
    _in_bounds(row, col) {
        return (row >= 0 && row < this.grid.length) && (col >= 0 && col < this.grid[0].length);
    }
    _clear_grid() {
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                this.grid[i][j].length = 0;
            }
        }
    }
    _insert_StaticBody(body) {
        const world_tl = vec2.copy(body.tl);
        const world_br = vec2.copy(body.br);
        const cell_tl = this.worldToCell(world_tl);
        const cell_br = this.worldToCell(world_br);
        // const cell_br = vec2.copy(world_br).sub(this.corner).div(this.span).floor();
        const cell = vec2.tmp();
        const cell_w = this.span.x;
        const ymin = world_tl.y;
        const ymax = world_br.y;
        const xmin = world_tl.x;
        const xmax = world_br.x;
        for (let y = ymin; y < ymax; y += LOWRES_CELL_W) {
            for (let x = xmin; x < xmax; x += LOWRES_CELL_W) {
                // cell.setXY(x, y).sub(this.corner).div(this.span).floor();
                const cell = this.worldToCell(vec2.tmp(x, y));
                if (this._in_bounds(cell.y, cell.x)) {
                    this.grid[cell.y][cell.x].push(body);
                }
            }
        }
    }
    _insert_bodies() {
        this._clear_grid();
        for (let body of this.staticbodies) {
            this._insert_StaticBody(body);
        }
    }
    _integrate() {
        for (let rbody of this.rigidbodies) {
            rbody.integrate();
        }
    }
    _resolve_collisions() {
        for (let rbody of this.rigidbodies) {
            const cell = this.worldToCell(rbody.curr);
            let row = cell.y - 1;
            let col = cell.x - 1;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (this._in_bounds(row + i, col + j) == false) {
                        continue;
                    }
                    this._solve_rbody(rbody, row + i, col + j);
                }
            }
        }
    }
    _sphere_collides(cpos, r, sbody, hit) {
        const minv = vec2.tmp().copy(sbody.tl);
        const maxv = vec2.tmp().copy(sbody.br);
        const x = math.clamp(cpos.x, minv.x, maxv.x);
        const y = math.clamp(cpos.y, minv.y, maxv.y);
        if (vec2.tmp(x, y).distSq(cpos) <= r * r) {
            hit.setXY(x, y);
            return true;
        }
        return false;
    }
    sphere_collides(cpos, r, hit) {
        const cell = this.worldToCell(cpos);
        let row = cell.y - 1;
        let col = cell.x - 1;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this._in_bounds(row + i, col + j) == false) {
                    continue;
                }
                for (let sbody of this.grid[row + i][col + j]) {
                    if (this._sphere_collides(cpos, r, sbody, hit)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    update() {
        this.accum += Engine.dtime();
        if (this.accum >= PHYS_TIMESTEP) {
            if (this.staticbodies.length != this.prev_count) {
                this._insert_bodies();
                console.log("Riperino");
                this.prev_count = this.staticbodies.length;
            }
        }
        while (this.accum >= PHYS_TIMESTEP) {
            this._integrate();
            this._resolve_collisions();
            this.accum -= PHYS_TIMESTEP;
        }
        const alpha = math.clamp(this.accum / PHYS_TIMESTEP, 0, 1);
        for (let body of this.rigidbodies) {
            body.interpolatePosition(alpha);
        }
    }
    draw(color = [255, 255, 255], stroke_size = 4) {
        const cell = this.worldToCell(Render.worldMouse());
        const world = this.cellToWorld(cell);
        stroke(200, 50, 50);
        strokeWeight(8);
        Render.rectCorner(world, this.span);
        fill(25, 200, 25);
        strokeWeight(1);
        if (this._in_bounds(cell.y, cell.x)) {
            for (let body of this.grid[cell.y][cell.x])
                Render.rectCorner(body.tl, body.span);
            fill(50, 150, 50);
            for (let body of this.grid[cell.y - 1][cell.x - 1])
                Render.rectCorner(body.tl, body.span);
            for (let body of this.grid[cell.y - 1][cell.x])
                Render.rectCorner(body.tl, body.span);
            for (let body of this.grid[cell.y - 1][cell.x + 1])
                Render.rectCorner(body.tl, body.span);
            for (let body of this.grid[cell.y][cell.x - 1])
                Render.rectCorner(body.tl, body.span);
            for (let body of this.grid[cell.y][cell.x + 1])
                Render.rectCorner(body.tl, body.span);
            for (let body of this.grid[cell.y + 1][cell.x - 1])
                Render.rectCorner(body.tl, body.span);
            for (let body of this.grid[cell.y + 1][cell.x])
                Render.rectCorner(body.tl, body.span);
            for (let body of this.grid[cell.y + 1][cell.x + 1])
                Render.rectCorner(body.tl, body.span);
        }
    }
}
//# sourceMappingURL=group.js.map