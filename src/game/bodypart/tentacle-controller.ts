import vec2 from "../../engine/math/vec2";
import BodyPartTentacle from "./tentacle";



export class TentacleController
{
    tentacles: Array<BodyPartTentacle>;

    constructor( limb_count: number, segment_count: number )
    {
        this.tentacles = new Array<BodyPartTentacle>(limb_count);


        const dir = vec2.tmp().setXY(0, 1);

        for (let i=0; i<segment_count; i++)
        {
            // const T = new BodyPartTentacle(16*dir.x, 16*dir.y, ropegroup, 8, random(32, 45), 0.25, 16);
            // T.hand.sprite.mass = 16;

            // this.tentacles.push(T);

            dir.rotate(2*Math.PI / segment_count);
        }
    }

    setAggression( n: number )
    {
        for (let T of this.tentacles)
        {
            T.aggression = n;
        }
    }
}
