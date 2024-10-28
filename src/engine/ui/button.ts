import { IO } from "../IO.js";
import ui_ElementBase from "./base.js";
import ui_Bounds from "./bounds.js";
import ui_Style from "./style.js";


export default class ui_Button extends ui_ElementBase
{
    label: string;
    callback: Function;

    constructor( label: string, callback: Function = () => {} )
    {
        let style = new ui_Style([50, 50, 50, 225], [255, 255, 255, 255]);
        style.padding   = [8, 8, 8, 16];
        style.radius    = [4, 4, 4, 4];
        style.center    = [true, false];

        style.maxWidth  = 512;

        style.minHeight = 52;
        style.maxHeight = 52;

        super(style, []);

        this.label    = label;
        this.callback = callback;
    }

    offMouseHover(): void
    {
        // const dt = deltaTime / 1000.0;
        // const a  = math.clamp(16.0*dt, 0.0, 1.0);

        // for (let i=0; i<this.style.fg.length; i++)
        // {
        //     this.style.bg[i] += a * (this.style_og.bg[i] - this.style.bg[i]);
        //     this.style.fg[i] += a * (this.style_og.fg[i] - this.style.fg[i]);
        // }

        this.style.bg = [...this.style_og.bg];
        this.style.fg = [...this.style_og.fg];
    }

    onMouseHover(): void
    {
        // const dt = deltaTime / 1000.0;
        // const a  = math.clamp(16.0*dt, 0.0, 1.0);

        // for (let i=0; i<this.style.fg.length; i++)
        // {
        //     this.style.bg[i] += a * (this.style_og.fg[i] - this.style.bg[i]);
        //     this.style.fg[i] += a * (this.style_og.bg[i] - this.style.fg[i]);
        // }
        this.style.bg = [...this.style_og.fg];
        this.style.fg = [...this.style_og.bg];
    }

    onMouseDown(): void
    {
        this.offMouseHover();
    }

    onMouseClick(): void
    {
        // Audio.getSound("click").play();
        this.callback();
    }

    update( bounds: ui_Bounds )
    {
        super.update(bounds);
    }

    draw( depth: number = 0.0 )
    {
        rectMode(CORNERS);
        textAlign(CENTER, CENTER);
        textSize(24);
        stroke(0);

        super.draw(depth);

        fill(this.style.fg);
        text(this.label, 0.5*(this.xmin+this.xmax), 0.5*(this.ymin+this.ymax));
    }
}


