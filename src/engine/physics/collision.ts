import { math } from "../math/math";
import vec2 from "../math/vec2";

const vec_tmp = [ new vec2, new vec2, new vec2, new vec2 ];

export const Intersection = {
    point:  new vec2,
    normal: new vec2
}



// function segment_AABB_intersects( start: vec2, end: vec2, tl: vec2, br: vec2 ): boolean
// {
//     let tmin = -Infinity;
//     let tmax = +Infinity;

//     if (dir.x != 0.0)
//     {
//         const tx1 = (tl.x - origin.x) / dir.x;
//         const tx2 = (br.x - origin.x) / dir.x;

//         tmin = Math.max(tmin, Math.min(tx1, tx2));
//         tmax = Math.min(tmin, Math.max(tx1, tx2));
//     }

//     if (dir.y != 0.0)
//     {
//         const ty1 = (tl.y - origin.y) / dir.y;
//         const ty2 = (br.y - origin.y) / dir.y;

//         tmin = Math.max(tmin, Math.min(ty1, ty2));
//         tmax = Math.min(tmin, Math.max(ty1, ty2));
//     }

//     return (tmax >= tmin);
// }



export
function swept_circle_AABB( cpos: vec2, r: number, rtl: vec2, rbr: vec2, P: vec2, N: vec2 )
{
    const tl = vec_tmp[0].copy(rtl).subXY(r, r);
    const br = vec_tmp[1].copy(rbr).addXY(r, r);

    const x = math.clamp(cpos.x, tl.x, br.x);
    const y = math.clamp(cpos.y, tl.y, br.y);

    P.setXY(x, y);

    if (P.distSq(cpos) <= r*r)
    {
        const dx = cpos.x - 0.5 * (tl.x + br.x);
        const dy = cpos.y - 0.5 * (tl.y + br.y);

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

    return false;
}