import vec2 from "../math/vec2";

const MIN_BLOCK_WIDTH = 1;
export const LOOKUP_SUBDIV = 256;


export class DrawItem
{
    row: number;
    col: number;
    w:   number;

    constructor( row: number, col: number, w: number )
    {
        this.row = row;
        this.col = col;
        this.w   = w;
    }
}



function swap( a: any, b: any )
{
    let tmp = a;
    a = b;
    b = tmp;
    return [a, b];
}


export default class WorldOptimiser
{
    static generateDrawlist( data: Array<Array<number>> ): Array<DrawItem>
    {
        let A = new Array<DrawItem>();
        let B = new Array<DrawItem>();

        const W = data.length;
        const H = data[0].length;
        let width = Math.min(W, H);

        for (let row=0; row<W; row+=width)
        {
            for (let col=0; col<H; col+=width)
            {
                A.push(new DrawItem(row, col, width));
            }
        }

        while (width > MIN_BLOCK_WIDTH)
        {
            WorldOptimiser.optimize_drawlist(A, B, data);
            [A, B] = swap(A, B);
            width /= 2;
        }

        return A;
    }


    static generateLookup( tl: vec2, br: vec2, scale: number, drawlist: Array<DrawItem> ): Array<Array<Array<DrawItem>>>
    {
        const lookup = new Array<Array<Array<DrawItem>>>();
        const SUBDIV = LOOKUP_SUBDIV;
        const grid_w = Math.floor(br.x - tl.x) / SUBDIV;

        // console.log("grid_w: ", grid_w);

        for (let i=0; i<grid_w; i++)
        {
            lookup.push([]);

            for (let j=0; j<grid_w; j++)
            {
                lookup[i].push([]);
            }
        }

        for (let block of drawlist)
        {
            const x = scale*block.col;
            const y = scale*block.row;
            const w = scale*block.w;

            for (let i=y; i<y+w; i+=SUBDIV)
            {
                for (let j=x; j<x+w; j+=SUBDIV)
                {
                    const r = Math.floor(i / SUBDIV);
                    const c = Math.floor(j / SUBDIV);

                    if (r<0 || r>=grid_w || c<0 || c>=grid_w)
                    {
                        console.log(`[${c}/${grid_w}][${r}/${grid_w}]`);
                        console.assert(false, "Ruh roh");
                        return;
                    }

                    lookup[r][c].push(block);
                }
            }
        }

        return lookup;
    }


    private static count_blocks( row: number, col: number, w: number, data: Array<Array<number>> ): number
    {
        let count = 0;

        for (let r=row; r<row+w; r++)
        {
            for (let c=col; c<col+w; c++)
            {
                if (data[r][c] > 0)
                {
                    count += 1;
                }
            }
        }

        return count;
    }


    private static optimize_drawlist( input: Array<DrawItem>, output: Array<DrawItem>,
                                      data: Array<Array<number>> )
    {
        output.length = 0;

        for (let block of input)
        {
            const col = block.col;
            const row = block.row;
            const w   = block.w;

            const block_count     = WorldOptimiser.count_blocks(row, col, w, data);
            const fully_solid     = (block_count == w*w);
            const partially_solid = (!fully_solid && block_count > 0);

            if (fully_solid)
            {
                output.push(block);
            }

            else if (partially_solid)
            {
                for (let r=row; r<row+w; r+=w/2)
                {
                    for (let c=col; c<col+w; c+=w/2)
                    {
                        if (WorldOptimiser.count_blocks(r, c, w/2, data) > 0)
                        {
                            output.push(new DrawItem(r, c, w/2));
                        }
                    }
                }
            }
        }
    }

}