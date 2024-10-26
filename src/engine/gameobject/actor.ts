import iRenderable from "../render/renderable.js";
import Transform from "./transform.js";
import iUpdatable from "../updatable.js";
import RenderEngine from "../render/renderengine.js";


export default class Actor implements iUpdatable, iRenderable
{
    _id: number;
    children: Array<Actor>;
    transform: Transform;
    
    constructor( x: number, y: number, theta: number = 0.0 )
    {
        this.transform = new Transform(x, y, theta);
        this.children = [];
    }

    getID(): number
    {
        return this._id;
    }

    giveChild( obj: any )
    {
        this.children.push(obj);
        this.transform.children.push(obj.transform);
    }

    update(): void { }
    draw( ren: RenderEngine ): void {  }
}
