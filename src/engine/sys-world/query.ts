import vec2 from "../math/vec2.js";


function inBounds( n: number, min: number, max: number ): boolean
{
    return (min <= n && n <= max);
}


export class WorldQueryResult
{
    static origin = new vec2(0, 0);
    static hit    = new vec2(0, 0);
    static normal = new vec2(0, 0);
    static dist   = 0.0;
}


export default class WorldQuery
{
    static sample_normal()
    {
        const dir = vec2.copy(WorldQueryResult.hit).sub(WorldQueryResult.origin);

        const x = WorldQueryResult.hit.x;
        const y = WorldQueryResult.hit.y;

        const center = vec2.tmp(x, y).floor().addXY(0.5);
        const xmag   = Math.abs(center.x - x);
        const ymag   = Math.abs(center.y - y);
        const xsign  = Math.sign(x - center.x) * ((dir.x < 0.0) ? -1 : +1);
        const ysign  = Math.sign(y - center.y) * ((dir.y < 0.0) ? -1 : +1);

        let dx = 0;
        let dy = 0;

        if (xmag > ymag)
        {
            dx = xsign;
        }

        else if (ymag > xmag)
        {
            dy = ysign;
        }

        else
        {
            dx = xsign;
            dy = ysign;
        }

        WorldQueryResult.normal.setXY(dx, dy).normalize();
    }


    static raycast( data: Array<Array<number>>, origin: vec2, dir: vec2 ): boolean
    {
        WorldQueryResult.origin.copy(origin);
        dir.normalize();

        let x = origin.x;
        let y = origin.y;

        let dx = dir.x;
        let dy = dir.y;

        if (dx == 0)
        {
            dx = 0.001;
        }

        if (dy == 0)
        {
            dy = 0.001;
        }

        const RUSS = vec2.tmp();
        RUSS.setXY(
            Math.sqrt(1 + (dy / dx) * (dy / dx)),
            Math.sqrt(1 + (dx / dy) * (dx / dy))
        );

        let row = int(y);
        let col = int(x);
        // console.log(row, col);

        let dxdist = 0.0;
        let dydist = 0.0;

        const vStep = vec2.tmp();

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

        while (dist < data.length)
        {
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

            if (!inBounds(row, 0, data.length-1) || !inBounds(col, 0, data[0].length-1))
            {
                return false;
            }

            if (data[row][col] >= 1)
            {
                WorldQueryResult.hit.setXY(x, y).addMul(dir, dist);
                WorldQueryResult.dist = dist;
                WorldQuery.sample_normal();
                return true;
            }
        }

        return false;
    }
}



