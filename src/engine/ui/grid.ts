import ui_ElementBase from "./base.js";
import ui_Bounds from "./bounds.js";
import ui_Style from "./style.js";


export default class ui_Grid extends ui_ElementBase
{
    private temp: ui_Bounds;

    constructor( ...children: ui_ElementBase[] )
    {
        let style = new ui_Style();

        style.radius = [0, 0, 0, 0];
        style.center = [false, false];

        style.maxWidth  = 9999;
        style.maxHeight = 64;

        super(style, children);
        this.temp = new ui_Bounds(0, 0, 1024, 1024);
    }

    update( bounds: ui_Bounds )
    {
        super.update(bounds);
        this.temp.copy(this.bounds);

        for (let child of this.children)
        {
            child.update(this.temp);

            this.temp.xmin += child.style.maxWidth;
            this.temp.xmin += 0.5*child.style.padding[1];
        }
    }

    draw( depth: number = 0 )
    {
        rectMode(CORNERS);
        stroke(0);

        super.draw(depth);

        for (let child of this.children)
        {
            child.draw(depth);
        }
    }
}


