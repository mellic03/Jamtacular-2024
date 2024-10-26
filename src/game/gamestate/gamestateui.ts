import Engine from "../../engine/engine.js";
import { EventFlag } from "../../engine/engine.js";
import GameState from "../../engine/gamestate/gamestate.js";
import RenderEngine from "../../engine/render/renderengine.js";
import ui_ElementBase from "../../engine/ui/base.js";
import ui_Bounds from "../../engine/ui/bounds.js";



export default class GameStateUI extends GameState
{
    static first: boolean = true;
    static canTransition: boolean = true;
    static sound_click: any = null;

    protected ui_root: ui_ElementBase;

    constructor( engine: Engine, name: string, parent: GameState = null )
    {
        if (GameStateUI.first)
        {
            engine.event.on(EventFlag.UPDATE, () => {
                GameStateUI.canTransition = true;
            });

            GameStateUI.first = false;
        }

        super(engine, name, parent);
    }

    transition( to: string ): void
    {
        if (GameStateUI.canTransition == true)
        {
            super.transition(to);
            GameStateUI.canTransition = false;
        }
    }

    enter( prev: GameState ): void
    {

    }

    exit( next: GameState ): void
    {

    }

    update(): void
    {
        super.update();
        this.ui_root.update(new ui_Bounds(0, 1024, 0, 1024));
    }

    draw( ren: RenderEngine )
    {
        translate(-ren.xoffset, -ren.yoffset, +5);
        this.ui_root.draw(ren, 0);
        translate(+ren.xoffset, +ren.yoffset, -5);
    }
}

