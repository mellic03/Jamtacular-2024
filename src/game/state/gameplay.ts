
import { Render } from "../../engine/render.js";
import { GameState, GameStateFlag } from "../../engine/gamestate.js";
import CharacterFloating from "../character/CharacterFloating.js";
import CharacterBiped from "../character/CharacterBiped.js";
import { UserInputMsg } from "./userinput.js";
import PlayerController from "../controller/controller-player.js";
import { IO } from "../../engine/IO.js";
import { RigidBodyCharacter } from "../character/Character.js";
import CharacterDDL from "../character/CharacterDDL.js";
import { Game, GameStateUserInput } from "../game.js";
import { CharacterController } from "../controller/controller.js";



export class GS_Gameplay extends GameState
{
    static player: RigidBodyCharacter;
    mouseSprite: Sprite;
    slider: any;

    static groups = {
        WORLD:  null,
        WORLD2: null,
        ROPES:  null,
        NPC:    null,
        PLAYER: null,
        CLICK:  null
    };


    public preload(): void
    {
        GameStateUserInput.on(UserInputMsg.PAUSE, () => {
            this.setFlag(GameStateFlag.UPDATE, false);
            this.setFlag(GameStateFlag.DRAW,   true);
            world.timeScale = 0;
        });

        GameStateUserInput.on(UserInputMsg.UNPAUSE, () => {
            this.setFlag(GameStateFlag.UPDATE, true);
            this.setFlag(GameStateFlag.DRAW,   true);
            world.timeScale = 1;
        });

        GS_Gameplay.groups.WORLD  = new Group();
        GS_Gameplay.groups.WORLD2 = new Group();
        GS_Gameplay.groups.ROPES  = new Group();
        GS_Gameplay.groups.NPC    = new Group();
        GS_Gameplay.groups.PLAYER = new Group();
        GS_Gameplay.groups.CLICK  = new Group();

        GS_Gameplay.groups.ROPES.overlaps(GS_Gameplay.groups.ROPES);
        GS_Gameplay.groups.ROPES.overlaps(GS_Gameplay.groups.ROPES);

        this.mouseSprite = new Sprite(-1000, -1000, 32, 32, "kinematic");
        GS_Gameplay.groups.CLICK.add(this.mouseSprite);

    }


    public setup(): void
    {
        super.setup();
        this.slider = createSlider(0, 1, 0, 0);

        GS_Gameplay.player = new CharacterBiped(0, 0, GS_Gameplay.groups.ROPES, new PlayerController());

        this.addCharacter(GS_Gameplay.player);
        this.addCharacter(new CharacterFloating(-256, 0, GS_Gameplay.groups.ROPES, null));
        this.addCharacter(new CharacterDDL(256, 0, GS_Gameplay.groups.ROPES, null));


        GS_Gameplay.groups.PLAYER.collides(GS_Gameplay.groups.PLAYER);
        GS_Gameplay.groups.ROPES.overlaps(GS_Gameplay.groups.CLICK);
    
        GS_Gameplay.groups.PLAYER.overlapping(GS_Gameplay.groups.CLICK, (A, B) => {

            const c0 = (IO.mouseClicked() == false);
            const c1 = (A.hasOwnProperty("AyyLmao") == false);
            const c2 = (A["AyyLmao"] as RigidBodyCharacter) == undefined;

            if (c0 || c1 || c2)
            {
                return;
            }

            const ctl = GS_Gameplay.player.popController();
            GS_Gameplay.player = (A["AyyLmao"] as RigidBodyCharacter);
            GS_Gameplay.player.pushController(ctl);

            this.slider.value(GS_Gameplay.player.aggression);
        });

    }


    public update(): void
    {
        super.update();

        const wmouse = Render.worldMouse();
        this.mouseSprite.x = wmouse.x;
        this.mouseSprite.y = wmouse.y;

        // if (GS_Gameplay.player != null)
        {
            GS_Gameplay.player.aggression = this.slider.value();

            const spos = Render.worldToScreen(GS_Gameplay.player.world.pos);
            this.slider.position(spos.x-76, spos.y-64);
        }

    }


    public draw(): void
    {
        super.draw();

        const wmouse = Render.worldMouse();
        circle(wmouse.x, wmouse.y, 64);

    }


    public addCharacter( C: RigidBodyCharacter ): void
    {
        GS_Gameplay.groups.PLAYER.add(C.sprite);
        this.addObject(C);
    }

}

