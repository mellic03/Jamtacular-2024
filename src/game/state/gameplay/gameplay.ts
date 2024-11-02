
import Render from "../../../engine/sys-render.js";
import { GameState, GameStateFlag } from "../../../engine/gamestate.js";
import { GS_Paused, } from "./state-paused.js";
import CharacterFloating from "../../character/CharacterFloating.js";
import CharacterBiped from "../../character/CharacterBiped.js";
import { GameStateUserInput } from "../../game.js";
import { UserInputMsg } from "../userinput.js";
import { GS_Playing } from "./state-playing.js";
import { iCharacterController } from "../../controller/controller.js";
import PlayerController from "../../controller/controller-player.js";
import FloatingController from "../../controller/controller-floating.js";
import { IO } from "../../../engine/IO.js";
import { RigidBodyCharacter } from "../../character/Character.js";



export class GS_Gameplay extends GameState
{
    static paused = false;

    static ctl1:    iCharacterController;
    static ctl2:    iCharacterController;
    static player:  CharacterBiped;
    static thing:   CharacterFloating;
    static current: CharacterBiped | CharacterFloating;

    static mouseSprite: Sprite;
    static slider;

    static groups = {
        WORLD:  null,
        ROPES:  null,
        NPC:    null,
        PLAYER: null,
        CLICK:  null
    };


    public preload(): void
    {
        GS_Gameplay.groups.WORLD  = new Group();
        GS_Gameplay.groups.ROPES  = new Group();
        GS_Gameplay.groups.NPC    = new Group();
        GS_Gameplay.groups.PLAYER = new Group();
        GS_Gameplay.groups.CLICK  = new Group();

        GS_Gameplay.groups.ROPES.overlaps(GS_Gameplay.groups.ROPES);
        GS_Gameplay.groups.ROPES.overlaps(GS_Gameplay.groups.ROPES);

        GS_Gameplay.mouseSprite = new Sprite(-1000, -1000, 32, 32, "kinematic");
        GS_Gameplay.groups.CLICK.add(GS_Gameplay.mouseSprite);
    }


    public setup(): void
    {
        super.setup();

        GS_Gameplay.ctl1   = new PlayerController();
        GS_Gameplay.ctl2   = new FloatingController();
        // GS_Gameplay.player = new CharacterBiped(0, 0, GS_Gameplay.groups.ROPES, GS_Gameplay.ctl1);
        GS_Gameplay.player = new CharacterBiped(0, 0, GS_Gameplay.groups.ROPES, null);
        GS_Gameplay.thing  = new CharacterFloating(-256, 0, GS_Gameplay.groups.ROPES, null);

        GS_Gameplay.groups.PLAYER.add(GS_Gameplay.player.sprite);
        GS_Gameplay.groups.PLAYER.add(GS_Gameplay.thing.sprite);

        this.addObject(GS_Gameplay.player);
        this.addObject(GS_Gameplay.thing);
    
    
        GS_Gameplay.current = GS_Gameplay.thing;
        GS_Gameplay.current.pushController(GS_Gameplay.ctl1);
        GS_Gameplay.slider = createSlider(0, 1, 0, 0);



        GS_Gameplay.groups.PLAYER.collides(GS_Gameplay.groups.PLAYER);
        GS_Gameplay.groups.ROPES.overlaps(GS_Gameplay.groups.CLICK);

        GS_Gameplay.groups.PLAYER.overlapping(GS_Gameplay.groups.CLICK, (A, B) => {
            if (IO.mouseClicked())
            {
                if ((A["AyyLmao"] as RigidBodyCharacter) == undefined)
                {
                    return;
                }

                if ((B["AyyLmao"] as RigidBodyCharacter) == undefined)
                {
                    return;
                }

                let CA = A["AyyLmao"] as RigidBodyCharacter;
                let CB = B["AyyLmao"] as RigidBodyCharacter;
            }
        });
        // this.addObject(new CharacterFloating(0, 127, GS_Gameplay.groups.ROPES, null));

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


        const wmouse = Render.worldMouse();

        GS_Gameplay.mouseSprite.x = wmouse.x;
        GS_Gameplay.mouseSprite.y = wmouse.y;

        GS_Gameplay.current.config.aggression = GS_Gameplay.slider.value();

        const spos = Render.worldToScreen(GS_Gameplay.current.world.pos);
        GS_Gameplay.slider.position(spos.x-76, spos.y-64);

        // GS_Gameplay.

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


        const wmouse = Render.worldMouse();
        circle(wmouse.x, wmouse.y, 64);
    
        // GS_Gameplay.player.draw();

    }


}

