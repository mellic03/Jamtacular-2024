import Actor from "../../engine/actor.js";
import { Engine, __engine } from "../../engine/engine.js";
import vec2 from "../../engine/math/vec2.js";
import { iHierarchical, Transform2 } from "../../engine/transform.js";
import { RigidBodyCharacter } from "../character/character.js";



export default class BodyPart implements iHierarchical
{
    local: Transform2;
    world: Transform2;
    children = new Array<iHierarchical>();

    direction: number = +1;

    constructor( x: number, y: number )
    {
        this.local = new Transform2(x, y, 0);
        this.world = new Transform2(0, 0, 0);
    }

    update()
    {

    }

    draw()
    {

    }

}

