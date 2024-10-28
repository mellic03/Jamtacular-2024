import { math } from "../math/math.js";
import ui_ElementBase from "./base.js";
import ui_Bounds from "./bounds.js";


export default class ui_Label extends ui_ElementBase
{
    label: string;

    constructor( label: string )
    {
        super();

        this.label = label;
        this.style.maxWidth  = 1024;
        this.style.maxHeight = 64;
    }

    update( bounds: ui_Bounds )
    {
        super.update(bounds);
    }

    draw( depth: number = 0 )
    {
        rectMode(CORNERS);
        textAlign(CENTER, CENTER);
        textSize(24);
        stroke(0);

        fill(this.style.fg);
        text(this.label, 0.5*(this.xmin+this.xmax), 0.5*(this.ymin+this.ymax));
    }
}


