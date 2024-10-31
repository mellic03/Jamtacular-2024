import { GameState, SceneManager } from "../../engine/gamestate.js";
import { IO, KEYCODE } from "../../engine/IO.js";
import { math } from "../../engine/math/math.js";
import Render from "../../engine/sys-render.js";
import { RootScene } from "../game.js";
import { SceneMainMenu } from "../ui.js";
import { StatePaused } from "./state-paused.js";


export class StateGameplay extends GameState
{
    constructor()
    {
        super();

    }


    public enter( fromstate?: GameState ): void
    {
        
    }


    public exit( tostate?: GameState ): void
    {

    }


    public update(): void
    {
        const wmouse = Render.worldMouse();
        const r0 = RootScene.thing.sprite.radius;
        const r1 = RootScene.player.sprite.radius;

        if (IO.mouseClicked() && wmouse.distSq(RootScene.thing.world.pos) < r0*r0)
        {
            const A = RootScene.player.popController();
            console.log(A);
            RootScene.thing.pushController(A);
        }

        if (IO.mouseWheel() != 0.0)
        {
            const ren = Render;
            Render.scale -= 0.001 * IO.mouseWheel();
            Render.scale = math.clamp(ren.scale, 0.05, 2.0);
        }


        const menu = SceneManager.getScene(SceneMainMenu);

        if (IO.keyTapped(KEYCODE.ESC))
        {
            menu.makeActive();
            this.scene.stateTransition(StatePaused);
            return;
        }


        RootScene.thing.update();
        RootScene.player.update();
    }


    public draw(): void
    {

    }

}
