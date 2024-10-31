import { math } from "./math";
import vec2 from "./vec2";


export default class GeometryTest
{
    // static RectRectOverlap( tl0: vec2, sp0: vec2, tl1: vec2, sp1: vec2 ): boolean
    // {
    //     const xoverlap = (tl0.x + sp0.x < tl1.x) || (tl0.x > tl1.x + sp1.x);
    //     const yoverlap = (tl0.y + sp0.y < tl1.y) || (tl0.y > tl1.y + sp1.y);

    //     return !(xoverlap || yoverlap);
    // }

    static RectRectOverlap( x0, y0, w0, h0, x1, y1, w1, h1 ): boolean
    {
        const xoverlap = (x0+w0 < x1) || (x0 > x1+w1);
        const yoverlap = (y0+h0 < y1) || (y0 > y1+h1);

        return !(xoverlap || yoverlap);
    }

}




