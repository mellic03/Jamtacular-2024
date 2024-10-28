import { Engine, __engine } from "../engine.js";
import { math } from "../math/math.js";
import vec2 from "../math/vec2.js";
import RigidBody from "../physics/rigidbody.js";
import { PHYS_TIMESTEP } from "../physics/physics.js";
import System from "../system.js";


const LOWRES_CELL_W  = 4096;
const LOWRES_CELL_HW = LOWRES_CELL_W / 2;
const GRID_DEGREE = 4;



export default class CollisionGroup
{
    corner: vec2;
    accum:  number = 0;

    bodies:        Array<RigidBody>;
    grids:         Array<Array<Array<Array<RigidBody>>>>;
    widths:        Array<number>;

    collides_with: Array<CollisionGroup>;



    constructor( x: number, y: number, centered: boolean = false )
    {
        this.corner = new vec2(x, y);

        if (centered)
        {
            this.corner.subXY(LOWRES_CELL_HW*GRID_DEGREE);
        }

        this.bodies = [];
        this.grids  = [];
        this.widths = [];
        this.collides_with = [];

        let lod = 0;
        let w   = GRID_DEGREE;

        for (let width=LOWRES_CELL_W; width>=16; width/=4)
        {
            this.grids.push([]);
            this.widths.push(width);

            for (let i=0; i<w; i++)
            {
                this.grids[lod].push([]);
                for (let j=0; j<w; j++)
                {
                    this.grids[lod][i].push([]);
                }
            }

            lod += 1;
            w   *= 4;
        }

    }

    collideWith( group: CollisionGroup )
    {
        this.collides_with.push(group);
    }

    private worldToGrid( lod: number, world: vec2, cell: vec2 ): void
    {
        cell.copy(world).sub(this.corner).div(this.widths[lod]);
    }

    private gridToWorld( lod: number, cell: vec2, world: vec2 ): void
    {
        world.copy(cell).mul(this.widths[lod]).add(this.corner);
    }

    private update_body( engine: Engine, body: RigidBody )
    {
        const pos  = vec2.tmpA;
        const cell = vec2.tmpB;

        // const x = body.pos.x;
        // const y = body.pos.y;
    }


    addBody( body: RigidBody ): void
    {
        this.bodies.push(body);
    }


    private _integrate( engine: Engine ): void
    {
        for (let body of this.bodies)
        {
            body.integrate(engine);
        }
    }

    update( engine: Engine ): void
    {
        this.accum += engine.dtime();

        while (this.accum > PHYS_TIMESTEP)
        {
            this._integrate(engine);
            this.accum -= PHYS_TIMESTEP;
        }

        const alpha = math.clamp(this.accum / PHYS_TIMESTEP, 0, 1);

        for (let body of this.bodies)
        {
            body.interpolatePosition(alpha);
        }
    }


    draw( lod: number, color=[255, 255, 255], stroke_size=4 ): void
    {
        noFill();
        stroke(color);
        strokeWeight(stroke_size);
        rectMode(CORNER);

        for (let i=0; i<this.grids[lod].length; i++)
        {
            for (let j=0; j<this.grids[lod].length; j++)
            {
                const cell = vec2.tmpA.setXY(j, i);
                const pos  = vec2.tmpB;
                this.gridToWorld(lod, cell, pos);

                rect(pos.x, pos.y, this.widths[lod], this.widths[lod]);
            }
        }
    }
}

