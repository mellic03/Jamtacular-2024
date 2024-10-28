import Transform from "../transform.js";
import vec2 from "./vec2.js";



const temp = [ new vec2(0, 0), new vec2(0, 0), new vec2(0, 0), new vec2(0, 0) ];
const start = new vec2(0, 0);
const end   = new vec2(0, 0);
const dir   = new vec2(0, 0);
const tmp   = new vec2(0, 0);


export default function FABRIK( joints: Array<vec2>, dists: Array<number>, total_dist: number, iterations=1 )
{
    // let total_dist = 0.0;

    // for (let d of dists)
    // {
    //     total_dist += d;
    // }

    start.copy(joints[0]);
    end.copy(joints[joints.length-1]);

    {
        dir.displacement(start, end);

        if (dir.magSq() > 0.99*total_dist*total_dist)
        {
            dir.normalizeMul(0.99*total_dist);

            let back = joints[joints.length-1];
            back.copy(start);
            back.add(dir)

            end.copy(back);
        }
    }

    for (let iter=0; iter<iterations; iter++)
    {
        // backward pass
        for (let i=joints.length-2; i>0; i--)
        {
            let left  = joints[i];
            let right = joints[i+1];

            dir.displacement(right, left);
            dir.normalizeMul(dists[i]);

            left.copy(right);
            left.add(dir);
        }

        // forward pass
        for (let i=0; i<joints.length-1; i++)
        {
            let left  = joints[i];
            let right = joints[i+1];

            dir.displacement(left, right);
            dir.normalizeMul(dists[i]);

            right.copy(left);
            right.add(dir);
        }
    }

    joints[joints.length-1].copy(end);
}

