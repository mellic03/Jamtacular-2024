import Transform from "../../engine/gameobject/transform.js";
import iRenderable from "../../engine/render/renderable.js";
import Actor from "../../engine/gameobject/actor.js";
import { idk_math } from "../../engine/math/math.js";
import { Spring } from "../../engine/math/spring.js";


export default class Limb extends Actor implements iRenderable
{
    // joints: Array<vec2> = [];
    dists: Array<number> = [];

    spring: Spring;

    constructor( x: number, y: number, segments: number, dist: number )
    {
        super(x, y, 0.0);

        this.spring = new Spring(-0.2, +0.2);

        let transforms = [];

        for (let i=0; i<segments; i++)
        {
            transforms.push(
                new Transform(dist, 0, 0)
            );

            this.dists.push(dist);
        }

        let curr: Transform = this.transform;

        for (let child of transforms)
        {
            curr.children.push(child);
            curr = curr.children[curr.children.length-1];
        }
    }

    update(): void {
        super.update();

        let offset = this.spring.iterate();

        let curr: Transform = this.transform.children[0];
        curr.theta = offset;
        
        let idx = 0;

        while (curr.children.length > 0)
        {
            curr = curr.children[0];
            curr.theta = offset + 0.2*idx*offset;
            idx += 1;
        }
    }


    draw(): void
    {
        rectMode(CENTER);
        stroke(255, 0, 0, 255);
        strokeWeight(8);

        let prev: Transform;
        let curr: Transform = this.transform;
        let idx = 0;

        while (curr.children.length > 0)
        {
            prev = curr;
            curr = curr.children[0];

            const A = prev.worldpos;
            const B = curr.worldpos;

            strokeWeight(18-idx);
            line(A.x, A.y, B.x, B.y);

            idx += 1;
        }

        strokeWeight(1);
    }

    contract( speed: number )
    {
        let curr: Transform = this.transform.children[0];

        while (curr.children.length > 0)
        {
            curr = curr.children[0];
            curr.theta -= speed;
        }
    }

    extend( speed: number )
    {
        let curr: Transform = this.transform.children[0];

        while (curr.children.length > 0)
        {
            curr = curr.children[0];
            curr.theta = idk_math.mix(curr.theta, 0.0, 0.01);
        }
    }

}
