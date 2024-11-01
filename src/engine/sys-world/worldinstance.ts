import System from "../system.js";
import vec2 from "../math/vec2.js";
import { Engine, __engine } from "../engine.js";
import WorldOptimiser, { DrawItem } from "./optimiser.js";
import WorldGenerator from "./generator.js";
import WorldQuery, { WorldQueryResult } from "./query.js";
import Render from "../sys-render.js";
import StaticBody from "../physics/staticbody.js";


export default class WorldInstance
{
    private img: any;
    private img_mode    = false;
    private img_loaded  = false;

    corner:   vec2;
    width:    number;
    height:   number;
    scale:    number;
    data:     Array<Array<number>>;
    drawlist: Array<DrawItem>;

    private init( x=0, y=0, width=128, height=128, scale=32 )
    {
        this.corner = new vec2(x, y).subXY(0.5*scale*width, 0.5*scale*height);
        this.width  = width;
        this.height = height;
        this.scale  = scale;
    }


    public generateWorld( x=0, y=0, w=128, h=128, scale=32, xoff=2048, yoff=1024 ): WorldInstance
    {
        this.init(x, y, w, h, scale);
        this.data     = WorldGenerator.generateWorld(this.width, this.height, this.scale, xoff, yoff);
        this.drawlist = WorldOptimiser.generateDrawlist(this.data);
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


    public generateColliders( cringe: Group )
    {
        for (let block of this.drawlist)
        {
            const x = this.scale*block.col + this.corner.x;
            const y = this.scale*block.row + this.corner.y;
            const w = this.scale*block.w;

            cringe.add((new StaticBody(x, y, w)).sprite);
        }
    }


    worldToCell( world: vec2 ): vec2
    {
        return vec2.copy(world).sub(this.corner).divXY(this.scale);
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
        rectMode(CORNER);
        noStroke();
        // stroke(255);
        // noFill();
        fill(50);

        for (let block of this.drawlist)
        {
            const x = this.scale*block.col + this.corner.x;
            const y = this.scale*block.row + this.corner.y;
            const w = this.scale*block.w;

            Render.rectCornerXY(x, y, w, w);
        }

    }

}
