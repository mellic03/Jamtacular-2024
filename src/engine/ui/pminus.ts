import { IO } from "../IO.js";
import ui_ElementBase from "./base.js";
import ui_Bounds from "./bounds.js";
import ui_Button from "./button.js";
import ui_Grid from "./grid.js";
import ui_Label from "./label.js";
import ui_Style from "./style.js";
import ui_Title from "./title.js";




class TestButton extends ui_Button
{
    constructor( label, callback )
    {
        super(label, callback);

        let style = new ui_Style([50, 50, 50, 225], [255, 255, 255, 255]);
        style.padding   = [16, 16, 16, 16];
        style.radius    = [4, 4, 4, 4];
        style.align     = [ui_Style.CENTER, ui_Style.CENTER];

        style.maxWidth  = 9999;
        style.maxHeight = 64;

        style.minWidth  = 4;
        style.minHeight = 4;

        this.updateStyle(style);
    }
}



export class ui_ValueRef<T>
{
    value: T;

    constructor( value: T )
    {
        this.value = value;
    }
}


function default_dec( vref: ui_ValueRef<any> ) { vref.value -= 1; }
function default_inc( vref: ui_ValueRef<any> ) { vref.value += 1; }


export default class ui_PMinus extends ui_Grid
{
    private vref: ui_ValueRef<any>;
    public label: string;

    /**
     * 
     * @param label 
     * @param valueRef 
     * @param dec Decrement function. e.g. function dec( v: ui_ValueRef ) { v.value -= 1; }
     * @param inc Increment function. e.g. function inc( v: ui_ValueRef ) { v.value += 1; }
     */
    constructor( label: string, valueRef: ui_ValueRef<any>, dec=default_dec, inc=default_inc )
    {
        const A = new ui_Title(label);
        A.style.padding  = [0, 0, 0, 0];
        A.style.radius   = [0, 0, 0, 0];
        A.style.align    = [ui_Style.CENTER, ui_Style.CENTER];
        A.style.maxWidth = 9999;
        A.updateStyle(A.style);

        super(1, 3,
            A,
            new TestButton("-", () => { dec(this.vref); }),
            new TestButton("+", () => { inc(this.vref); })
        );

        this.style.padding = [0, 0, 0, 0];
        this.style.radius  = [0, 0, 0, 0];
        this.style.align   = [ui_Style.CENTER, ui_Style.CENTER];
        this.updateStyle(this.style);

        this.col_ratios = [0.8, 0.1, 0.1];
        this.label      = label;
        this.vref       = valueRef;
    }

    update( bounds: ui_Bounds )
    {
        super.update(bounds);
        this.label = `Value: ${this.vref.value}`;
    }

    draw( depth: number = 0.0 )
    {
        super.draw(depth);
    }
}


