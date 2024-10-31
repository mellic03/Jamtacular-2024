import Render from "../sys-render.js";
import ui_ElementBase from "./base.js";
import ui_Bounds from "./bounds.js";
import ui_Style from "./style.js";


export default class ui_List extends ui_ElementBase
{
    private temp: ui_Bounds;

    constructor( ...children: ui_ElementBase[] )
    {
        let style = new ui_Style();
        style.align = [ui_Style.CENTER, ui_Style.CENTER];

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

            this.temp.ymin += child.style.maxHeight;
            this.temp.ymin += 0.5*child.style.padding[3];
        }
    }

    draw( depth: number = 0 )
    {
        rectMode(CORNERS);
        stroke(0);

        super.draw(depth);

        for (let child of this.children)
        {
            child.draw(depth+1);
        }
    }
}


