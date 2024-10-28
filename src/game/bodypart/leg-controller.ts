import Actor from "../../engine/actor.js";
import { Engine, __engine } from "../../engine/engine.js";
import { EventEmitting } from "../../engine/sys-event.js";
import BodyPartLeg, { LegParams } from "./leg.js";



export default abstract class LegController
{
    parent: Actor & EventEmitting<number>;
    params: LegParams;
    legs:   Array<BodyPartLeg>;

    constructor( parent: Actor & EventEmitting<number> )
    {
        this.parent = parent;
        this.params = new LegParams();
        this.legs   = [];
    }

    update( engine: Engine )
    {
        for (let L of this.legs)
        {
            L.transform.mult(this.parent.transform);
            L.update(engine);
        }
    }

    draw( engine: Engine )
    {
        if (this.legs[0].direction == -1)
        {
            this.legs[0].draw(engine);
            this.legs[1].draw(engine);
        }

        else
        {
            this.legs[1].draw(engine);
            this.legs[0].draw(engine);
        }
    }

    setParams( params: LegParams ): void
    {
        for (let L of this.legs)
        {
            L.params = params;
        }
    }

    addLeg( leg: BodyPartLeg )
    {
        leg.parent = this.parent;
        this.legs.push(leg);
    }

    setRestHeight( height: number )
    {
        for (let leg of this.legs)
        {
            leg.params.rest_height = height;
        }
    }

    setDirection( dir: number )
    {
        for (let leg of this.legs)
        {
            leg.direction = Math.sign(dir);
        }
    }

}

