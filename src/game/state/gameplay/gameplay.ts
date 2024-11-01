
import Render from "../../../engine/sys-render.js";
import { GameState, GameStateFlag } from "../../../engine/gamestate.js";
import { GS_Paused, } from "./state-paused.js";
import CharacterFloatingType from "../../character/floating-type.js";
import CharacterBipedType from "../../character/biped-type.js";
import { GameStateUserInput } from "../../game.js";
import { UserInputMsg } from "../userinput.js";
import { GS_Playing } from "./state-playing.js";
import { iCharacterController } from "../../controller/controller.js";
import PlayerController from "../../controller/controller-player.js";
import FloatingController from "../../controller/controller-floating.js";



export class GS_Gameplay extends GameState
{
    static paused = false;

    static ctl1:   iCharacterController;
    static ctl2:   iCharacterController;
    // static player: CharacterBipedType;

    static groups = {
        WORLD:  null,
        ROPES:  null,
        NPC:    null,
        PLAYER: null
    };


    public preload(): void
    {
        GS_Gameplay.groups.WORLD  = new Group();
        GS_Gameplay.groups.ROPES  = new Group();
        GS_Gameplay.groups.NPC    = new Group();
        GS_Gameplay.groups.PLAYER = new Group();
    }


    public setup(): void
    {
        super.setup();

        GS_Gameplay.ctl1   = new PlayerController();
        GS_Gameplay.ctl2   = new FloatingController();

        // GS_Gameplay.player = new CharacterBipedType(
        //     0,  9.81, GS_Gameplay.groups.PLAYER, null
        // );

        this.addObject(new CharacterFloatingType(
            0, 127, GS_Gameplay.groups.ROPES, GS_Gameplay.ctl1
        ));

        GS_Gameplay.groups.ROPES.overlaps(GS_Gameplay.groups.ROPES);

        GameStateUserInput.on(UserInputMsg.PAUSE, () => {
            this.setFlag(GameStateFlag.UPDATE, false);
            this.setFlag(GameStateFlag.DRAW,   true);
            GS_Gameplay.paused = true;
            world.timeScale = 0;
        });

        GameStateUserInput.on(UserInputMsg.UNPAUSE, () => {
            this.setFlag(GameStateFlag.UPDATE, true);
            this.setFlag(GameStateFlag.DRAW,   true);
            GS_Gameplay.paused = false;
            world.timeScale = 1;
        });

    }


    public update(): void
    {
        super.update();

        // const wmouse = Render.worldMouse();
        // const r0 = 4*GS_Gameplay.thing.sprite.radius;
        // const r1 = 4*GS_Gameplay.player.sprite.radius;

        // if (wmouse.distSq(GS_Gameplay.thing.world.pos) < r0*r0)
        // {
        //     rectMode(CENTER);
        //     noFill();
        //     stroke(50, 200, 50);
        //     rect(GS_Gameplay.thing.world.x, GS_Gameplay.thing.world.y, r0);

        //     if (IO.mouseClicked())
        //     {
        //         const A = GS_Gameplay.player.popController();
        //         console.log(A);
        //         GS_Gameplay.thing.pushController(A);
        //     }
        // }

        // GS_Gameplay.player.update();

    }


    public draw(): void
    {
        super.draw();

        // GS_Gameplay.player.draw();

    }


}

