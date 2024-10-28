import Actor from "../../engine/actor.js";
import { Engine, __engine } from "../../engine/engine.js";


export default class BodyPart extends Actor
{
    parent: Actor = null;
    direction: number = +1;

    constructor( x: number, y: number )
    {
        super(x, y, 0);
    }

    update( engine: Engine )
    {
        super.update(engine);
    }

    draw( engine: Engine )
    {
        fill(0, 255, 0);
        circle(this.x, this.y, 32);

    }

}

