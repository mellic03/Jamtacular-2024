import { math } from "../math/math.js";
import ui_ElementBase from "./base.js";
import ui_Bounds from "./bounds.js";
import ui_Style from "./style.js";


export default class ui_Title extends ui_ElementBase
{
    label: string;

    constructor( label: string )
    {
        let style = new ui_Style([50, 50, 50, 225], [255, 255, 255, 255]);
        style.padding[3] = 32;
        style.maxWidth  = 1024;
        style.maxHeight = 64;

        super(style, []);
        this.label = label;
        // this.style.maxWidth  = 1024;
        // this.style.maxHeight = 64;
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

        super.draw(depth);

        fill(this.style.fg);
        text(this.label, 0.5*(this.xmin+this.xmax), 0.5*(this.ymin+this.ymax));

        // ren.rect(this.xmin, this.ymin, depth, this.xmax, this.ymax);
    }
}


