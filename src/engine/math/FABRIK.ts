import Transform from "../gameobject/transform.js";
import vec2 from "./vec2.js";


export default function FABRIK( joints: Array<vec2>, dists: Array<number>,
    iterations: number )
{
    let total_dist = 0.0;

    for (let d of dists)
    {
        total_dist += d;
    }

    let start = joints[0];
    let end   = joints[joints.length-1];

    let left  = new vec2();
    let right = new vec2();
    let dir   = new vec2();
    let tmp   = new vec2();
    let len: number;

    {
        dir.direction(start, end);
        len = dir.mag();
        dir.normalize();

        if (len > (0.99 * total_dist))
        {
            tmp.copy(dir);
            tmp.mul(total_dist);
            tmp.add(start);

            joints[joints.length-1].copy(tmp);
        }
    }

    for (let iter=0; iter<iterations; iter++)
    {
        // backward pass
        for (let i=joints.length-2; i>=1; i--)
        {
            left  = joints[i];
            right = joints[i+1];

            dir.direction(right, left);

            let desired = dists[i];
            let derror  = dir.mag() - desired;

            dir.normalizeMul(derror);

            joints[i].add(dir);
        }

        // forward pass
        for (let i=1; i<joints.length; i++)
        {
            left  = joints[i-1];
            right = joints[i];

            dir.direction(left, right);

            let desired = dists[i-1];
            let derror  = dir.mag() - desired;

            dir.normalizeMul(derror);

            joints[i].add(dir);
        }
    }
}
// export default function FABRIK( joints: Array<vec2>, dists: Array<number>,
//                                 iterations: number )
// {
//     let total_dist = 0.0;

//     for (let d of dists)
//     {
//         total_dist += d;
//     }

//     let start = joints[0].worldpos;
//     let end   = joints[joints.length-1].worldpos;

//     let left  = new vec2();
//     let right = new vec2();
//     let dir   = new vec2();
//     let tmp   = new vec2();
//     let len: number;

//     {
//         dir.direction(start, end);
//         len = dir.mag();
//         dir.normalize();

//         if (len > (0.99 * total_dist))
//         {
//             tmp.copy(dir);
//             tmp.mul(total_dist);
//             tmp.add(start);

//             joints[joints.length-1].worldpos.copy(tmp);
//         }
//     }

//     for (let iter=0; iter<iterations; iter++)
//     {
//         // backward pass
//         for (let i=joints.length-2; i>=1; i--)
//         {
//             left  = joints[i].worldpos;
//             right = joints[i+1].worldpos;

//             dir.direction(right, left);

//             let desired = dists[i];
//             let derror  = dir.mag() - desired;
        
//             dir.normalizeMul(derror);

//             joints[i].worldpos.add(dir);
//         }

//         // forward pass
//         for (let i=1; i<joints.length; i++)
//         {
//             left  = joints[i-1].worldpos;
//             right = joints[i].worldpos;

//             dir.direction(left, right);

//             let desired = dists[i-1];
//             let derror  = dir.mag() - desired;
        
//             dir.normalizeMul(derror);

//             joints[i].worldpos.add(dir);
//         }
//     }
// }