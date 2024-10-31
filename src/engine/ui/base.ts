import { IO } from "../IO.js";
import { math } from "../math/math.js";
import Render from "../sys-render.js";
import ui_Bounds from "./bounds.js";
import ui_Style from "./style.js";


function deepCopy( obj )
{
    return JSON.parse(JSON.stringify(obj));
}



export default class ui_ElementBase
{
    protected style_og = new ui_Style;
    public    style    = new ui_Style;

    public label:    string;
    public children: Array<ui_ElementBase>;
    public bounds:   ui_Bounds;

    constructor( style: ui_Style = new ui_Style, children: Array<ui_ElementBase> = [] )
    {
        this.style    = deepCopy(style);
        this.style_og = deepCopy(style);

        this.children = children;
        this.bounds   = new ui_Bounds(0, 0, 1024, 1024);
    }

    offMouseHover(): void {  };
    onMouseHover():  void {  };
    onMouseDown():   void {  };
    onMouseClick():  void {  };

    restoreStyle(): void
    {
        this.style = deepCopy(this.style_og);
    }

    updateStyle( style: ui_Style = null ): void
    {
        if (style == null)
        {
            style = this.style;
        }
        
        this.style    = deepCopy(style);
        this.style_og = deepCopy(style);
    }

    update( bounds: ui_Bounds )
    {
        this.bounds.copy(bounds);
    
        this.bounds.xmin += this.style.padding[0] / 2;
        this.bounds.xmax -= this.style.padding[1] / 2;
        this.bounds.ymin += this.style.padding[2] / 2;
        this.bounds.ymax -= this.style.padding[3] / 2;

        let width  = math.clamp(this.style.minWidth, this.style.maxWidth, this.xmax-this.xmin);
            width  = math.min(width, this.xmax-this.xmin);
        
        let height = math.clamp(this.style.minHeight, this.style.maxHeight, this.ymax-this.ymin);
            height = math.min(height, this.ymax-this.ymin);


        let cx = this.xmin + width/2;
        let cy = this.ymin + height/2;

        switch (this.style.align[0])
        {
            default: break;
            case ui_Style.CENTER:  cx = 0.5 * (this.xmin + this.xmax);  break;
            case ui_Style.RIGHT: break;
        }

        if (this.style.align[1] == ui_Style.CENTER)
        {
            cy = 0.5 * (this.ymin + this.ymax);
        }
    
        this.bounds.fromCenterSpan(cx, cy, width, height);


        const mouse = Render.screenMouse();
        const x = math.clamp(mouse.x, this.xmin, this.xmax);
        const y = math.clamp(mouse.y, this.ymin, this.ymax);

        if (x == mouse.x && y == mouse.y)
        {
            this.onMouseHover();

            if (IO.mouseClicked())
            {
                this.onMouseClick();
            }

            else if (IO.mouseDown())
            {
                this.onMouseDown();
            }
        }

        else
        {
            this.offMouseHover();
        }
    }

    draw( depth: number = 0 )
    {
        fill(this.style.bg);
        rect(this.xmin, this.ymin, this.xmax, this.ymax, ...this.style.radius);
    }

    get xmin()
    {
        return this.bounds.xmin;
    }

    get xmax()
    {
        return this.bounds.xmax;
    }

    get ymin()
    {
        return this.bounds.ymin;
    }

    get ymax()
    {
        return this.bounds.ymax;
    }

    get width()
    {
        return math.clamp(this.xmax - this.xmin, this.style.minWidth, this.style.maxWidth);
    }

    get height()
    {
        return math.clamp(this.ymax - this.ymin, this.style.minHeight, this.style.maxHeight);
    }

}


