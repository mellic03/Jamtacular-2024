import { idk_math } from "./math/math.js";
import { JtNoise } from "./math/noise.js";
import vec2 from "./math/vec2.js";
import { NoiseSystem } from "./noise/noisesystem.js";
import ComputeBuffer from "./render/buffer.js";
import iRenderable from "./render/renderable.js";
import RenderEngine from "./render/renderengine.js";


export class GridRaycastResult
{
    pos: vec2;
    blocktype: number;

    constructor( pos: vec2, blocktype: number )
    {
        this.pos = pos;
        this.blocktype = blocktype;
    }
}



export class WorldGridSector implements iRenderable
{
    tmpA:   vec2;
    tmpB:   vec2;

    pos:    vec2;
    span:   vec2;
    width:  number;
    scale:  number;

    ren:    RenderEngine;
    buffer: ComputeBuffer;

    neighbours = [];

    constructor( x, y, width, scale, ren: RenderEngine )
    {
        this.tmpA   = new vec2(0, 0);
        this.tmpB   = new vec2(0, 0);

        this.pos    = new vec2(x, y);
        this.span   = new vec2(scale*width, scale*width);
        this.width  = width;
        this.scale  = scale;

        this.ren    = ren;
        this.buffer = new ComputeBuffer(width, width, ren.getOfflineContext());

        // noiseDetail(8, 0.5);
        const pixels = this.buffer.map();

        for (let row=0; row<width; row++)
        {
            for (let col=0; col<width; col++)
            {
                const idx = 4 * (width*row + col);
        
                const x = this.pos.x + this.scale*col + 2048;
                const y = this.pos.y - this.scale*row + 2048;

                let r = 0;
                let g = 0;
                let b = 0;

                let height = NoiseSystem.FBM(x/1024, y/1024, 8, 0.5, 1.8, NoiseSystem.perlin);
                // let height = JtNoise.FBM(x/1024, y/1024, 8, 0.5, 1.8);
                // let height = 1.25*noise(x/1024, y/1024);
                g = idk_math.clamp(0, 1, height - 0.2);

                this.tmpA.from(x, y);
                this.tmpB.from(2048, 2048);
                let dist = this.tmpA.dist(this.tmpB);

                if (dist < 150 || g < 0.35)
                {
                    g = 0.1;
                    b = 0.6;
                }

                else if (g < 0.4)
                {
                    r = 0.5;
                    g = 0.5;
                    b = 0.2;
                }

                pixels[idx+0] = r;
                pixels[idx+1] = g;
                pixels[idx+2] = b;
                pixels[idx+3] = height;
            }
        }

        this.buffer.unmap();
    }

    addNeighbour( dx, dy )
    {
        const x = this.pos.x + dx*this.span.x;
        const y = this.pos.y + dy*this.span.y;

        this.neighbours.push(new WorldGridSector(x, y, this.width, this.scale, this.ren));
    }
    
    draw()
    {

    }
}


export class WorldGrid
{
    ren:    RenderEngine;
    scale:  number;
    temp:   Array<vec2>;

    entry_sector: WorldGridSector;
    curr_sector:  WorldGridSector;

    constructor( ren: RenderEngine, sector_w: number, scale: number )
    {
        this.ren    = ren;
        this.scale  = scale;
        this.temp   = [ new vec2(0, 0), new vec2(0, 0), new vec2(0, 0), new vec2(0, 0) ];

        this.entry_sector = new WorldGridSector(0, 0, sector_w, scale, ren);
        this.curr_sector  = this.entry_sector;
    }


    collision( origin: vec2 )
    {
        for (let neighbour of this.curr_sector.neighbours)
        {

        }
    }

    // private world_to_grid( pos: vec2, out: vec2 )
    // {
    //     out.copy(pos);
    //     out.div(this.scale);
    //     out.floor();
    // }

    // private in_bounds( cell: vec2 ): boolean
    // {
    //     return (cell.x >= 0 && cell.y >= 0 && cell.x < this.width && cell.y < this.height);
    // }

    // private sample( pos: vec2 ): number
    // {
    //     this.world_to_grid(pos, this.temp[0]);

    //     if (this.in_bounds(this.temp[0]) == false)
    //     {
    //         return -1;
    //     }

    //     return this.data[this.width*this.temp[0].y + this.temp[0].x];
    // }

    // raycast( origin: vec2, dir: vec2, output: GridRaycastResult ): boolean
    // {
    //     let pos = this.temp[3];
    //     pos.copy(origin);
    
    //     for (let i=0; i<64; i++)
    //     {
    //         let blocktype = this.sample(pos);

    //         if (blocktype > 0)
    //         {
    //             output.pos = pos;
    //             output.blocktype = blocktype;
    //             return true;
    //         }

    //         pos.add(dir);
    //     }

    //     return false;
    // }

}