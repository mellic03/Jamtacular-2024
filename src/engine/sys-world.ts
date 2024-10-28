import System from "./system.js";
import vec2 from "./math/vec2.js";
import { Engine, __engine } from "./engine.js";
import sys_Render, { RenderBuffer } from "./sys-render.js";
import { Framebuffer, Graphics, Shader } from "p5";
import sys_Noise from "./sys-noise.js";
import { math } from "./math/math.js";
import sys_Physics from "./sys-physics.js";
import CollisionGroup from "./physics/group.js";



// class WorldChunk
// {
//     col:   number;
//     row:   number;
//     width: number;
//     scale: number;
//     span:  number;
//     data:  RenderBuffer;

//     constructor( col, row, w=64, s=4, engine: Engine )
//     {
//         this.col = col
//         this.row = row;
//         this.width = w;
//         this.scale = s;
//         this.span  = w*s;

//         const ren = engine.getSystem(sys_Render);
//         const ctx = ren.getOfflineContext();
//         this.data = new RenderBuffer(this.width, this.width, ctx);

//         this.generate(engine);
//     }

//     private generate( engine: Engine )
//     {
//         const xpos = this.width * this.col;
//         const ypos = this.width * this.row;

//         const nsys   = engine.getSystem(sys_Noise);
//         const pixels = this.data.map();

//         for (let row=0; row<this.width; row++)
//         {
//             for (let col=0; col<this.width; col++)
//             {
//                 const idx = 4 * (this.width*row + col);

//                 const x = xpos + col;
//                 const y = ypos - row;

//                 if (y < 0)
//                 {
//                     pixels[idx+0] = 160 / 255.0;
//                     pixels[idx+1] = 204 / 255.0;
//                     pixels[idx+2] = 254 / 255.0;
//                     pixels[idx+3] = 1;
                    
//                     continue
//                 }

//                 let r = 0;
//                 let g = 0;
//                 let b = 0;

//                 let rockiness = math.max((-y + 512)/1024, 0);
//                     rockiness = 0.8 * Math.exp(rockiness - 1);

//                 let height = rockiness * nsys.FBM(x/256+2048, y/256+2048+128, 8, 0.7, 2.0, nsys.perlin);
//                 let depth  = math.max(y/64.0, 0);
//                 let attenuation = 1.0 / (1.0 + depth*depth);
//                     // attenuation = 1.0;

//                 g = math.clamp(0, 1, height - 0.12);

//                 if (g < 0.4)
//                 {
//                     r = 0.5*(g + attenuation);
//                     g = 0.5*(g + attenuation);
//                     b = 0.3*(g + attenuation);
//                 }

//                 else if (g < 1.4)
//                 {
//                     r = 0.2 * attenuation;
//                     g = 0.2 * attenuation;
//                     b = 0.5 * attenuation;
//                 }

//                 pixels[idx+0] = r;
//                 pixels[idx+1] = g;
//                 pixels[idx+2] = b;
//                 pixels[idx+3] = 1;
//             }
//         }

//         this.data.unmap();
//     }
// }


export class HitInfo
{
    static res = new vec2(0, 0);

    x: number;
    y: number;

    constructor( x, y )
    {
        this.x = x;
        this.y = y;
    }
}


export default class sys_World extends System
{
    pos:    vec2;
    width:  number;
    height: number;
    scale:  number;
    // chunks = new Array<WorldChunk>;
    data:   Array<Array<number>>;
    program: Shader;

    constructor( x=-1024, y=-1024, width=64, height=64, scale=32 )
    {
        super();

        this.pos    = new vec2(x, y);
        this.width  = width;
        this.height = height;
        this.scale  = scale;
        this.data   = new Array<Array<number>>();

        for (let i=0; i<height; i++)
        {
            this.data.push([]);

            for (let j=0; j<width; j++)
            {
                this.data[i].push(1);

                const dx = 32-j;
                const dy = 32-i;

                if (Math.sqrt(dx*dx + dy*dy) < 16)
                {
                    this.data[i][j] = 0;
                }
            }
        }
    }


    preload( engine: Engine ): void
    {

    }


    setup( engine: Engine ): void
    {
        const physys = __engine.getSystem(sys_Physics);
        const group  = physys.createGroup("world", new CollisionGroup(0, 0, true));
    }


    worldToGridX( x: number ): number
    {
        return (x - this.pos.x) / this.scale;
    }

    worldToGridY( y: number ): number
    {
        return (y - this.pos.y) / this.scale;
    }

    gridToWorldX( x: number ): number
    {
        return (x * this.scale) + this.pos.x;
    }

    gridToWorldY( y: number ): number
    {
        return (y * this.scale) + this.pos.y;
    }


    raycast( x: number, y: number, dx: number, dy: number, out: vec2 = HitInfo.res ): boolean
    {
        x = this.worldToGridX(x);
        y = this.worldToGridY(y);

        if (dx == 0)
        {
            dx = 0.001;
        }

        if (dy == 0)
        {
            dy = 0.001;
        }

        const RUSS = vec2.tmpA;
        RUSS.setXY(
            Math.sqrt(1 + (dy / dx) * (dy / dx)),
            Math.sqrt(1 + (dx / dy) * (dx / dy))
        );

        let row = int(y);
        let col = int(x);
        // console.log(row, col);

        let dxdist = 0.0;
        let dydist = 0.0;

        const vStep = vec2.tmpB;

        if (dx < 0)
        {
            vStep.x = -1;
            dxdist = (x - col) * RUSS.x;
        }

        else
        {
            vStep.x = 1;
            dxdist = (col+1 - x) * RUSS.x;
        }

        if (dy < 0)
        {
            vStep.y = -1;
            dydist = (y - row) * RUSS.y;
        }

        else
        {
            vStep.y = 1;
            dydist = (row+1 - y) * RUSS.y;
        }


        let dist = 0.0;

        while (dist < this.data.length)
        {
            // console.log(row, col);

            if (dxdist < dydist)
            {
                col += vStep.x;
                dist = dxdist;
                dxdist += RUSS.x;
            }

            else
            {
                row += vStep.y;
                dist = dydist;
                dydist += RUSS.y;
            }

            if (row < 0 || row >= this.data.length || col < 0 || col >= this.data[0].length)
            {
                return false;
            }

            if (this.data[row][col] >= 1)
            {
                // console.log("HIT");
            
                const dir = vec2.temp;
                dir.setXY(dx, dy);
                dir.mul(this.scale * dist);

                out.setXY(this.gridToWorldX(x), this.gridToWorldY(y));
                out.add(dir);

                return true;
            }
        }

        return false;
    }


    update( engine: Engine ): void
    {
        const ren = engine.getSystem(sys_Render);

        push();
        translate(this.pos.x, this.pos.y);

        rectMode(CORNER);
        noStroke();
        fill(50);

        for (let i=0; i<this.data.length; i++)
        {
            for (let j=0; j<this.data[i].length; j++)
            {
                // if (this.data[i][j] == 0)
                // {
                //     fill(50);
                //     rect(this.scale*j, this.scale*i, this.scale, this.scale);
                // }

                if (this.data[i][j] > 0)
                {
                    rect(this.scale*j, this.scale*i, this.scale, this.scale);
                }
            }
        }

        pop();
    }

}
