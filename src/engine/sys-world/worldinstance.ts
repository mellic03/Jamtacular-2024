import System from "../system.js";
import vec2 from "../math/vec2.js";
import WorldOptimiser, { DrawItem, LOOKUP_SUBDIV } from "./optimiser.js";
import WorldGenerator from "./generator.js";
import WorldQuery, { WorldQueryResult } from "./query.js";
import { Render } from "../render.js";
import StaticBody from "../physics/staticbody.js";
import { Graphics, Image } from "p5";
import GeometryTest from "../math/geometry.js";


export default class WorldInstance
{
    private img: Image;
    private img_mode    = false;
    private img_loaded  = false;
    private callback: Function;
    private static tmpset = new Set<DrawItem>();

    corner:   vec2;
    tl:       vec2;
    br:       vec2;
    width:    number;
    height:   number;
    scale:    number;
    data:     Array<Array<number>>;
    course:   Array<Array<number>>;
    drawlist: Array<DrawItem>;
    lookup:   Array<Array<Array<DrawItem>>>;


    private init( x=0, y=0, width=128, height=128, scale=32 )
    {
        this.corner = new vec2(x, y).subXY(0.5*scale*width, 0.5*scale*height);
        this.tl     = new vec2().copy(this.corner);
        this.br     = new vec2().copy(this.tl).addXY(scale*width, scale*height);
        this.width  = width;
        this.height = height;
        this.scale  = scale;
    }


    public generateWorld( x=0, y=0, w=128, h=128, scale=32, xoff=2048, yoff=1024,
                          callback?: Function ): WorldInstance
    {
        this.init(x, y, w, h, scale);
        this.data     = WorldGenerator.generateWorld(this.width, this.height, this.scale, xoff, yoff);
        this.drawlist = WorldOptimiser.generateDrawlist(this.data);
        this.lookup   = WorldOptimiser.generateLookup(this.tl, this.br, this.scale, this.drawlist);
        this.img      = WorldGenerator.generateImage(this.width, this.height, this.data);

        return this;
    }


    public loadWorld( filepath: string, x=0, y=0, w=128, h=128, scale=32 ): WorldInstance
    {
        this.init(x, y, w, h, scale);

        this.img_mode    = true;
        this.img_loaded  = false;

        this.img = loadImage(filepath, () => {
            this.img_loaded  = true;
        });

        return this;
    }


    public generateColliders( cringe: Group, tl: vec2, br: vec2, visited: Set<DrawItem> )
    {
        const SUBDIV = LOOKUP_SUBDIV;
        const grid_w = Math.floor(this.br.x - this.tl.x) / SUBDIV;

        const tl1 = vec2.copy(tl).sub(this.tl);
        const br1 = vec2.copy(br).sub(this.tl);


        for (let i=tl1.y; i<br1.y; i+=SUBDIV)
        {
            for (let j=tl1.x; j<br1.x; j+=SUBDIV)
            {
                const row = Math.floor(i/SUBDIV);
                const col = Math.floor(j/SUBDIV);
                // console.log(`[${col}/${grid_w}][${row}/${grid_w}]`);

                for (let block of this.lookup[row][col])
                {
                    if (visited.has(block))
                    {
                        continue;
                    }

                    visited.add(block);

                    // if (r<0 || r>=this.lookup.length || c<0 || c>=this.lookup.length)
                    // {
                    //     console.assert(false, "Ruh roh");
                    // }

                    const x = this.scale*block.col + this.corner.x;
                    const y = this.scale*block.row + this.corner.y;
                    const w = this.scale*block.w;
        
                    // if (x+w<tl.x || x>br.x)
                    // {
                    //     continue;
                    // }
                
                    // if (y+w<tl.y || y>br.y)
                    // {
                    //     continue;
                    // }
        
                    cringe.add((new StaticBody(x, y, w)).sprite);
                }
            }
        }


    }


    worldToCell( world: vec2 ): vec2
    {
        return vec2.copy(world).sub(this.corner).divXY(this.scale).floor();
    }

    cellToWorld( cell: vec2 ): vec2
    {
        return vec2.copy(cell).mulXY(this.scale).add(this.corner);
    }

    inBounds( row: number, col: number ): boolean
    {
        return (row < 0) || (row >= this.data.length) || (col < 0) || (col >= this.data[0].length);
    }


    raycast( ox: number, oy: number, dx: number, dy: number ): boolean
    {
        const origin = this.worldToCell(vec2.tmp(ox, oy));
        const dir    = vec2.tmp(dx, dy).normalize();

        if (WorldQuery.raycast(this.data, origin, dir))
        {
            const cell  = vec2.copy(WorldQueryResult.hit);
            const world = this.cellToWorld(cell);
            WorldQueryResult.hit.copy(world);
        
            return true;
        }

        return false;
    }


    isReady(): boolean
    {
        if (this.img_mode == false)
        {
            return true;
        }

        if (this.img_loaded == true)
        {
            this.data     = WorldGenerator.loadWorld(this.width, this.height, this.img);
            this.drawlist = WorldOptimiser.generateDrawlist(this.data);
            return true;
        }

        return false;
    }


    preload(): void
    {

    }


    setup(): void
    {

    }


    draw(): void
    {
        imageMode(CORNER);

        Render.imageCornerXY(
            this.img,
            this.corner.x, this.corner.y,
            this.scale*this.width, this.scale*this.height
        );
    }

    // draw(): void
    // {
    //     rectMode(CORNER);
    //     noStroke();
    //     // stroke(255);
    //     // noFill();
    //     fill(50);

    //     for (let block of this.drawlist)
    //     {
    //         const x = this.scale*block.col + this.corner.x;
    //         const y = this.scale*block.row + this.corner.y;
    //         const w = this.scale*block.w;

    //         Render.rectCornerXY(x, y, w, w);
    //     }

    // }

}
