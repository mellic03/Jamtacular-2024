const MIN_BLOCK_WIDTH = 1;


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