import Actor from "./actor.js";
import vec2 from "../math/vec2.js";
import RenderEngine from "../render/renderengine.js";


export default class idk_Camera extends Actor
{
    ren: RenderEngine;

    constructor( ren: RenderEngine )
    {
        super(0, 0);
        this.ren = ren;
    }

    worldToScreen( input: vec2, output: vec2 ): void
    {
        output.copy(input);
        output.sub(this.transform.worldpos);
    }

    screenToWorld( input: vec2, output: vec2 ): void
    {
        output.copy(input);
        output.x -= this.ren.xoffset;
        output.y -= this.ren.yoffset;
        output.add(this.transform.worldpos);
    }

    get x()
    {
        return this.transform.worldpos.x;
    }

    get y()
    {
        return this.transform.worldpos.y;
    }
}
