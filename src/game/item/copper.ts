import { Engine, __engine } from "../../engine/engine.js";
import Item from "./item.js";


export default class item_Copper extends Item
{
    constructor( x: number, y: number )
    {
        super(x, y);
        this.image_path = "assets/img/copper.png";
    }

}

