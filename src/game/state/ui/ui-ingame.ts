import { idk_Stack } from "../../../engine/ds/idk_stack.js";
import { GameState } from "../../../engine/gamestate.js";
import Render from "../../../engine/sys-render.js";
import ui_ElementBase from "../../../engine/ui/base.js";
import ui_Bounds from "../../../engine/ui/bounds.js";
import ui_Button from "../../../engine/ui/button.js";
import ui_Grid from "../../../engine/ui/grid.js";
import ui_List from "../../../engine/ui/list.js";
import ui_Style, { setSyleSpanLimitAsPixels, setSyleSpanLimitAsRatio } from "../../../engine/ui/style.js";
import { GameStateGameplay, GameStateWorld } from "../../game.js";



class ui_HUDdummy extends ui_Button
{
    constructor()
    {
        super("X");

        setSyleSpanLimitAsPixels(this.style, 4, 9999, 4, 9999);
        this.updateStyle();
    }
}


class ui_HUD extends ui_Grid
{
    constructor( rows: number, cols: number )
    {
        const children = [];

        for (let i=0; i<rows*cols; i++)
        {
            children.push(new ui_HUDdummy());
        }

        super(rows, cols, ...children);


        // this.style.maxHeight = 128;
        setSyleSpanLimitAsRatio(this.style, 64/1080, 9999/1080, 64/1920, 128/1920);

        this.style.align = [ui_Style.CENTER, ui_Style.TOP];
        this.updateStyle();
    }
}



export class GS_InGameGUI extends GameState
{
    private ui: ui_ElementBase;
    private renbounds = new ui_Bounds(0, 0, 1, 1);

    constructor()
    {
        super();

        // this.ui = new ui_Grid(3, 3,
        //     new ui_Button("A"), new ui_Button("B"), new ui_Button("C"),
        //     new ui_Button("X"), new ui_Button("Y"), new ui_Button("Z"),
        //     new ui_Button("1"), new ui_Button("2"), new ui_Button("3")
        // );

        this.ui = new ui_HUD(1, 6);
    }


    update(): void
    {
        super.update();
    
        this.renbounds.fromMinMax(0, Render.width, 0, Render.height);
        this.ui.update(this.renbounds);
    }


    private diagnostics(): void
    {
        stroke(255);
        fill(255);
        textSize(24);
        strokeWeight(1);
        textAlign(RIGHT, CENTER);

        Render.screenText(`fps: ${Render.avgFPS().toPrecision(4)}`, Render.width-25, 25);


        textAlign(LEFT, CENTER);
        const S0 = GameStateGameplay.stack.data;
        const S1 = GameStateWorld.stack.data;


        Render.screenText(`GS_Gameplay.stack`, 0.85*Render.width, 3*Render.height/4 - 64*S0.length);
        for (let i=S0.length-1; i>=0; i--)
            Render.screenText(`${i}\t\t\t${S0[i].name}`, 0.85*Render.width, 3*Render.height/4 - 64*i);

        Render.screenText(`GS_World.stack`, 0.7*Render.width, 3*Render.height/4 - 64*S1.length);
        for (let i=S1.length-1; i>=0; i--)
            Render.screenText(`${i}\t\t\t${S1[i].name}`, 0.7*Render.width, 3*Render.height/4 - 64*i);


        textAlign(CENTER, TOP);

        if (this.topState())
        {
            const txt = `GS_Gameplay.state: ${this.topState().name}`;
            Render.screenText(txt, Render.width/2, Render.height-100);
        }
    }


    draw(): void
    {
        super.draw();

        Render.pushInverseViewTransform();
        this.ui.draw();
        Render.popInverseViewTransform();

        this.diagnostics();
    }

}
