import { __engine } from "../engine/engine.js";
import { GameScene, SceneManager } from "../engine/gamestate.js";
import sys_Image from "../engine/sys-image.js";
import CharacterBipedType from "./character/biped-type.js";
import { RigidBodyCharacter } from "./character/character.js";
import FloatingController from "./character/controller-floating.js";
import PlayerController from "./character/controller-player.js";
import CharacterFloatingType from "./character/floating-type.js";

import { StateSetup } from "./state-game/state-startup.js";
import { StateGameplay } from "./state-game/state-gameplay.js";
import { StatePaused } from "./state-game/state-paused.js";
import { StateRegion1 } from "./state-game/state-region1.js";
import { StateRegion2 } from "./state-game/state-region2.js";
import { SceneMainMenu } from "./ui.js";
import Render from "../engine/sys-render.js";





export class SceneGameplay extends GameScene
{
    public setup(): void
    {
        this.addState(new StateSetup);
        this.addState(new StatePaused);
        this.addState(new StateGameplay);
        this.addState(new StateRegion1);
        this.addState(new StateRegion2);

        this.stateTransition(StateSetup);

        // RootScene.player = new CharacterBipedType(-800, 386, RootScene.pctl);
        // RootScene.thing  = new CharacterFloatingType(0, 0, RootScene.tctl);
    }


    public update(): void
    {
        const state = this.currentState();
    
        if (state)
        {
            state.update();
        }
    }


    public draw(): void
    {
        const state = this.currentState();
    
        if (state)
        {
            state.draw();
        }

        stroke(255);
        fill(255);
        textSize(24);
        textAlign(RIGHT, CENTER);

        Render.screenText(`fps: ${Render.avgFPS().toPrecision(4)}`, Render.width-25, 25);

        // RootScene.thing.draw();
        // RootScene.player.draw();
    }
}





export class RootScene extends GameScene
{
    static pctl = new PlayerController();
    static tctl = new FloatingController();

    static player: RigidBodyCharacter;
    static thing:  RigidBodyCharacter;

    constructor()
    {
        super();

        SceneManager.addScene(this.makeActive());
        SceneManager.addScene(new SceneMainMenu().makeActive());
        SceneManager.addScene(new SceneGameplay().makeActive());

        // this.addState(new StateSetup);
        // this.addState(new StatePaused);
        // this.addState(new StateGameplay);
        // this.addState(new StateRegion1);
        // this.addState(new StateRegion2);

        // this.stateTransition(StateSetup);
    }


    public preload(): void
    {
        const imgsys = __engine.getSystem(sys_Image);
        imgsys.load("assets/img/meat.jpg");
        imgsys.load("assets/img/michael.png");
        imgsys.load("assets/img/heart-red.png");
        imgsys.load("assets/img/rope.png");
    }


    public setup(): void
    {
        angleMode(RADIANS);

        RootScene.player = new CharacterBipedType(0, 128, RootScene.pctl);
        RootScene.thing  = new CharacterFloatingType(0, 0, RootScene.tctl);
    }


    public update(): void
    {
        // const state = this.currentState();
    
        // if (state)
        // {
        //     state.update();
        // }
    }


    public draw(): void
    {
        // const state = this.currentState();
    
        // if (state)
        // {
        //     state.draw();
        // }

        RootScene.thing.draw();
        RootScene.player.draw();
    }

}

