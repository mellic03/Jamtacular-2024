import idk_vector from "../ds/idk_vector.js";
import ui_ElementBase from "./base.js";
import ui_Bounds from "./bounds.js";
import ui_Dummy from "./dummy.js";
import ui_Style from "./style.js";


export default class ui_Grid extends ui_ElementBase
{
    public  row_ratios = new Array<number>();
    public  col_ratios = new Array<number>();
    private temp:  ui_Bounds;
    public  rows:  number;
    public  cols:  number;


    constructor( rows: number, cols: number, ...children: ui_ElementBase[] )
    {
        let style = new ui_Style([0, 0, 0, 0], [0, 0, 0, 0]);

        style.padding = [0, 0, 0, 0];
        style.margin  = [0, 0, 0, 0];
        style.radius  = [0, 0, 0, 0];
        style.align   = [ui_Style.LEFT, ui_Style.LEFT];

        style.maxWidth  = 9999;
        style.maxHeight = 9999;

        while (children.length < rows*cols)
        {
            children.push(new ui_Dummy());
        }

        super(style, children);

        this.rows       = rows;
        this.cols       = cols;
        this.temp       = new ui_Bounds(0, 0, 1024, 1024);
        this.row_ratios = new idk_vector<number>(rows, 1.0/rows);
        this.col_ratios = new idk_vector<number>(cols, 1.0/cols);
    }

    update( bounds: ui_Bounds )
    {
        super.update(bounds);
        this.temp.copy(this.bounds);

        const child_w = this.width / this.cols;
        const child_h = this.height / this.rows;

        const xmin_og = this.temp.xmin;
        const ymin_og = this.temp.ymin;

        let xmin = this.temp.xmin;
        let ymin = this.temp.ymin;
        let xmax = xmin;
        let ymax = ymin;

        for (let i=0; i<this.rows; i++)
        {
            let yw = this.row_ratios[i] * this.height;
            this.temp.ymin = ymin;
            this.temp.ymax = ymin + yw;

            xmin = xmin_og;

            for (let j=0; j<this.cols; j++)
            {
                let xw = this.col_ratios[j] * this.width;

                this.temp.xmin = xmin;
                this.temp.xmax = xmin + xw;

                this.children[this.cols*i + j].update(this.temp);

                xmin += xw;
            }

            ymin += yw;
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


