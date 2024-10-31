import { __engine, Engine } from "../engine.js";
import { math } from "../math/math.js";
import vec2 from "../math/vec2.js";
import Render from "../sys-render.js";
import { WorldQueryResult } from "../sys-world/query.js";
import sys_World from "../sys-world/sys-world.js";
import { PHYS_TIMESTEP } from "./physics.js";
import BasedRigidBody from "./rigidbody-based.js";
import RigidBody from "./rigidbody.js";
import BasedStaticBody from "./staticbody-based.js";


const LOWRES_CELL_W  = 512;
const LOWRES_CELL_HW = LOWRES_CELL_W / 2;
const GRID_DEGREE = 128;




// class CollisionGrid
// {
//     corner: vec2;
//     span:   vec2;

//     rigidbodies:  Array<Array<Array<RigidBody>>>;
//     staticbodies: Array<Array<Array<StaticBody>>>;

//     constructor( x, y, w, h )
//     {
//         this.corner = new vec2(x, y);
//         this.span   = new vec2(w, h);

//         this.rigidbodies  = [];
//         this.staticbodies = [];
//     }

//     private worldToCell( world: vec2, cell: vec2 ): void
//     {
//         cell.copy(world).sub(this.corner);
//         cell.x /= this.span.x;
//         cell.y /= this.span.y;
//         cell.floor();
//     }

//     private gridToWorld( cell: vec2, world: vec2 ): void
//     {
//         world.copy(cell);
//         world.x *= this.span.x;
//         world.y *= this.span.y;
//         world.add(this.corner);
//     }


//     // update( engine: Engine ): void
//     // {
//     //     for (let rbody of this.rigidbodies )
//     //     {
//     //         const cell = vec2.tmp().copy(rbody.pos)
//     //     }
//     // }

// }


export default class BasedCollisionGroup
{
    corner: vec2;
    span:   vec2;
    accum:  number = 0;

    rigidbodies:   Array<BasedRigidBody>;
    staticbodies:  Array<BasedStaticBody>;
    prev_count:    number = 0;

    grid:          Array<Array<Array<BasedStaticBody>>>;
    visited:       Set<number>;
    collides_with: Array<BasedCollisionGroup>;


    constructor( x: number, y: number, centered: boolean = true )
    {
        this.corner = new vec2(x, y);
        this.span   = new vec2(LOWRES_CELL_W, LOWRES_CELL_W);

        if (centered)
        {
            this.corner.subXY(LOWRES_CELL_HW*GRID_DEGREE);
        }

        this.rigidbodies   = [];
        this.staticbodies  = [];
        this.grid          = [];
        this.visited       = new Set<number>();
        this.collides_with = [];

        for (let i=0; i<GRID_DEGREE; i++)
        {
            this.grid.push([]);

            for (let j=0; j<GRID_DEGREE; j++)
            {
                this.grid[i].push([]);
            }
        }
    }

    collideWith( group: BasedCollisionGroup )
    {
        this.collides_with.push(group);
    }

    private worldToCell( world: vec2 ): vec2
    {
        return vec2.copy(world).sub(this.corner).div(this.span).floor();
    }

    private cellToWorld( cell: vec2 ): vec2
    {
        return vec2.copy(cell).mul(this.span).add(this.corner);
    }

    addBody( body: BasedRigidBody ): void
    {
        this.rigidbodies.push(body);
    }

    addStaticBody( body: BasedStaticBody ): void
    {
        this.staticbodies.push(body);
    }

    private _tunneled( pos: vec2, vel: vec2 ): boolean
    {
        if (vel.magSq() <= 0.001)
        {
            return false;
        }

        const dir   = vec2.copy(vel).normalize();
        const world = __engine.getSystem(sys_World);

        if (world.raycast(pos.x, pos.y, dir.x, dir.y))
        {
            const res = WorldQueryResult.hit;

            if (pos.distSq(res) < vel.magSq())
            {
                return true;
            }
        }

        return false;
    }

    private _resolve_tunnel( rbody: BasedRigidBody ): void
    {
        const MAX_RESOLVE = 8;
        let   count = 0;

        const disp = vec2.copy(rbody.vprev);

        for (let i=0; i<MAX_RESOLVE; i++)
        {
            if (this._tunneled(rbody.curr, disp) == false)
            {
                break;
            }

            disp.mulXY(0.5);
            rbody.curr.subMul(disp, 1);
            count += 1;
        }
    }

    private _collides( rbody: BasedRigidBody, sbody: BasedStaticBody, P: vec2, N: vec2 ): boolean
    {
        const r    = rbody.radius;
        const rSQ  = r*r;
        const minv = vec2.tmp().copy(sbody.tl);
        const maxv = vec2.tmp().copy(sbody.br);

        const x = math.clamp(rbody.curr.x, minv.x, maxv.x);
        const y = math.clamp(rbody.curr.y, minv.y, maxv.y);


        P.setXY(x, y);

        if (P.distSq(rbody.curr) <= rSQ)
        {
            const dx = rbody.curr.x - sbody.center.x;
            const dy = rbody.curr.y - sbody.center.y;

            if (Math.abs(dx) > Math.abs(dy))
            {
                N.setXY(Math.sign(dx), 0).normalize();
            }

            else
            {
                N.setXY(0, Math.sign(dy)).normalize();
            }

            return true;
        }

        // else if (rbody.vprev.magSq() > 0.01)
        // {
        //     const pos = rbody.curr;
        //     const vel = rbody.vprev;

        //     const world = __engine.getSystem(sys_World);
        //     const dir   = vec2.copy(rbody.vprev).normalize();

        //     if (world.raycast(pos.x, pos.y, dir.x, dir.y))
        //     {
        //         const hit = WorldQueryResult.hit;

        //         if (pos.distSq(hit) + vel.magSq() <= rSQ)
        //         {
        //             N.copy(WorldQueryResult.normal);
        //             return true;
        //         }
        //     }
        // }

        return false;
    }


    private _resolve( rbody: BasedRigidBody, sbody: BasedStaticBody, P: vec2, N: vec2 )
    {
        const dir = vec2.tmp().displacement(P, rbody.curr);
    
        if (dir.magSq() < 0.0001)
        {
            return;
        }

        const overlap = rbody.radius - rbody.curr.dist(P);
        dir.normalize().mulXY(overlap).mulXY(1);

        rbody.curr.add(dir);
        // rbody.friction_time = rbody.friction;

        // circle(P.x, P.y, 20);
    }


    private _solve_rbody( rbody: BasedRigidBody, row: number, col: number ): void
    {
        const P = vec2.tmp();
        const N = vec2.tmp();

        for (let group of this.collides_with)
        {
            for (let sbody of group.grid[row][col])
            {
                this._resolve_tunnel(rbody);
    
                if (this._collides(rbody, sbody, P, N))
                {
                    // circle(rbody.curr.x, rbody.curr.y, 25);
                    this._resolve(rbody, sbody, P, N);
                }
            }
        }
    }



    private _in_bounds( row: number, col: number ): boolean
    {
        return (row >= 0 && row < this.grid.length) && (col >= 0 && col < this.grid[0].length);
    }


    private _clear_grid()
    {
        for (let i=0; i<this.grid.length; i++)
        {
            for (let j=0; j<this.grid[i].length; j++)
            {
                this.grid[i][j].length = 0;
            }
        }
    }


    private _insert_StaticBody( body: BasedStaticBody )
    {
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
    
        for (let y=ymin; y<ymax; y+=LOWRES_CELL_W)
        {
            for (let x=xmin; x<xmax; x+=LOWRES_CELL_W)
            {
                // cell.setXY(x, y).sub(this.corner).div(this.span).floor();
                const cell = this.worldToCell(vec2.tmp(x, y));

                if (this._in_bounds(cell.y, cell.x))
                {
                    this.grid[cell.y][cell.x].push(body);
                }
            }
        }
    }


    private _insert_bodies()
    {
        this._clear_grid();

        for (let body of this.staticbodies)
        {
            this._insert_StaticBody(body);
        }
    }


    private _integrate( engine: Engine ): void
    {
        for (let rbody of this.rigidbodies)
        {
            rbody.integrate(engine);
        }
    }


    private _resolve_collisions( engine: Engine ): void
    {
        for (let rbody of this.rigidbodies)
        {
            const cell = this.worldToCell(rbody.curr);

            let row = cell.y - 1;
            let col = cell.x - 1;

            for (let i=0; i<3; i++)
            {
                for (let j=0; j<3; j++)
                {
                    if (this._in_bounds(row+i, col+j) == false)
                    {
                        continue;
                    }

                    this._solve_rbody(rbody, row+i, col+j);
                }
            }
        }
    }


    private _sphere_collides( cpos: vec2, r: number, sbody: BasedStaticBody, hit: vec2 ): boolean
    {
        const minv = vec2.tmp().copy(sbody.tl);
        const maxv = vec2.tmp().copy(sbody.br);

        const x = math.clamp(cpos.x, minv.x, maxv.x);
        const y = math.clamp(cpos.y, minv.y, maxv.y);

        if (vec2.tmp(x, y).distSq(cpos) <= r*r)
        {
            hit.setXY(x, y);
            return true;
        }

        return false;
    }


    public sphere_collides( cpos: vec2, r: number, hit: vec2 ): boolean
    {
        const cell = this.worldToCell(cpos);

        let row = cell.y - 1;
        let col = cell.x - 1;

        for (let i=0; i<3; i++)
        {
            for (let j=0; j<3; j++)
            {
                if (this._in_bounds(row+i, col+j) == false)
                {
                    continue;
                }

                for (let sbody of this.grid[row+i][col+j])
                {
                    if (this._sphere_collides(cpos, r, sbody, hit))
                    {
                        return true;
                    }
                }
            }
        }

        return false;
    }


    update( engine: Engine ): void
    {
        this.accum += engine.dtime();

        if (this.accum >= PHYS_TIMESTEP)
        {
            if (this.staticbodies.length != this.prev_count)
            {
                this._insert_bodies();
                console.log("Riperino");
                this.prev_count = this.staticbodies.length;
            }
        }

        while (this.accum >= PHYS_TIMESTEP)
        {
            this._integrate(engine);
            this._resolve_collisions(engine);
            this.accum -= PHYS_TIMESTEP;
        }

        const alpha = math.clamp(this.accum / PHYS_TIMESTEP, 0, 1);

        for (let body of this.rigidbodies)
        {
            body.interpolatePosition(alpha);
        }
    }


    draw( color=[255, 255, 255], stroke_size=4 ): void
    {
        const cell  = this.worldToCell(Render.worldMouse());
        const world = this.cellToWorld(cell);

        stroke(200, 50, 50);
        strokeWeight(8);
        Render.rectCorner(world, this.span);

        fill(25, 200, 25);
        strokeWeight(1);

        if (this._in_bounds(cell.y, cell.x))
        {
            for (let body of this.grid[cell.y][cell.x])
                Render.rectCorner(body.tl, body.span);

            fill(50, 150, 50);

            for (let body of this.grid[cell.y-1][cell.x-1])
                Render.rectCorner(body.tl, body.span);

            for (let body of this.grid[cell.y-1][cell.x])
                Render.rectCorner(body.tl, body.span);

            for (let body of this.grid[cell.y-1][cell.x+1])
                Render.rectCorner(body.tl, body.span);

            for (let body of this.grid[cell.y][cell.x-1])
                Render.rectCorner(body.tl, body.span);

            for (let body of this.grid[cell.y][cell.x+1])
                Render.rectCorner(body.tl, body.span);

            for (let body of this.grid[cell.y+1][cell.x-1])
                Render.rectCorner(body.tl, body.span);

            for (let body of this.grid[cell.y+1][cell.x])
                Render.rectCorner(body.tl, body.span);

            for (let body of this.grid[cell.y+1][cell.x+1])
                Render.rectCorner(body.tl, body.span);

        }

    }
}

