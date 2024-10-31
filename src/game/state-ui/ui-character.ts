import ui_Button from "../../engine/ui/button.js";
import ui_List from "../../engine/ui/list.js";
import ui_Title from "../../engine/ui/title.js";
import { RootScene } from "../game.js";
import { UI_State } from "../../engine/ui/ui-state.js";
import Render from "../../engine/sys-render.js";
import ui_Bounds from "../../engine/ui/bounds.js";
import ui_Style from "../../engine/ui/style.js";
import { RigidBodyCharacter } from "../character/character.js";
import ui_ElementBase from "../../engine/ui/base.js";
import ui_PMinus, { ui_ValueRef } from "../../engine/ui/pminus.js";
import ui_Grid from "../../engine/ui/grid.js";



class TestList extends ui_List
{
    public C: RigidBodyCharacter;
    private tmp = new ui_Bounds(0, 0, 1, 1);
    private btn = new Array<ui_Button>();
    // private btn = [, new ui_Button("Test Button"), new ui_Button("Test Button"), new ui_Button("Test Button"), new ui_Button("Test Button")];


    constructor( ...children: ui_ElementBase[] )
    {
        let style = new ui_Style();
        style.align = [ui_Style.CENTER, ui_Style.CENTER];

        super(...children);
        this.tmp = new ui_Bounds(0, 0, 1024, 1024);
    }


    update( bounds: ui_Bounds ): void
    {
        super.update(bounds);
    }

}


class TestButton extends ui_Button
{
    constructor( label )
    {
        super(label);

        let style = new ui_Style([50, 50, 50, 225], [255, 255, 255, 255]);
        style.padding   = [16, 16, 16, 16];
        style.radius    = [4, 4, 4, 4];
        style.align     = [ui_Style.CENTER, ui_Style.CENTER];

        style.maxWidth  = 9999;
        style.maxHeight = 128;

        style.minWidth  = 4;
        style.minHeight = 4;

        this.updateStyle(style);
    }
}



export class UI_Character extends UI_State
{
    private ui: ui_Grid;
    private valueA = new ui_ValueRef(0);

    constructor()
    {
        super();

        this.makeActive();

        this.ui = new ui_Grid(1, 1,
            new ui_PMinus("ui_PMinus Test", this.valueA)
        );

        this.ui.style.align = [ui_Style.CENTER, ui_Style.CENTER];
        this.ui.updateStyle(this.ui.style);
        
    }

    update(): void
    {
        // const C = Game.getSelectedCharacter();
        this.ui.update(new ui_Bounds(0, Render.width, 0, Render.height));
    }

    draw(): void
    {
        this.ui.draw();
    }
}
