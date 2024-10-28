import { Image } from "p5";
import Actor from "../../engine/actor.js";
import { Engine, __engine } from "../../engine/engine.js";
import BodyPart from "./bodypart.js";


export default class BodyPartHead extends BodyPart
{
    image: Image

    constructor( x: number, y: number, image )
    {
        super(x, y);

        this.image = image;
    }

    update( engine: Engine )
    {

    }

    draw( engine: Engine )
    {
        image(this.image, this.x, this.y, 48, 48);

        // fill(0, 255, 0);
        // circle(this.x, this.y, 32);
    }

}

