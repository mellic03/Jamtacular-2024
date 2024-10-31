import { math } from "../math/math.js";
import ui_ElementBase from "./base.js";
import ui_Bounds from "./bounds.js";


export default class ui_Dummy extends ui_ElementBase
{
    constructor()
    {
        super();

        this.style.bg = [0, 0, 0, 0]
        this.style.maxWidth  = 99999;
        this.style.maxHeight = 99999;
        this.updateStyle();
    }

    update( bounds: ui_Bounds )
    {
        super.update(bounds);
    }

    draw( depth: number = 0 )
    {
        
    }
}


