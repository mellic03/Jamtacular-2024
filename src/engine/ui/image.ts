import { IO } from "../IO.js";
import { math } from "../math/math.js";
import ui_ElementBase from "./base.js";
import ui_Bounds from "./bounds.js";
import ui_Style from "./style.js";


export default class ui_Image extends ui_ElementBase
{
    img_name: any;

    constructor( img_name: string, size: number = 32 )
    {
        let style = new ui_Style([50, 50, 50, 225], [255, 255, 255, 255]);
        style.padding   = [16, 16, 16, 16];
        style.radius    = [4, 4, 4, 4];
        style.center    = [false, true];

        style.minWidth  = size;
        style.maxWidth  = size;
        style.minHeight = size;
        style.maxHeight = size;

        super(style, []);
        this.img_name = img_name;
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

        // super.draw(depth);
        // const img = ImgManager.getImgNamed(this.img_name);

        // imageMode(CORNERS);
        // image(img, this.xmin, this.ymin, this.xmax, this.ymax);

    }
}


