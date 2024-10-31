import BasedAnimation from "../engine/animation.js";
import { Engine, __engine } from "../engine/engine.js";
import { IO } from "../engine/IO.js";
import Scene from "../engine/scene.js";
import sys_Image from "../engine/sys-image.js";
import sys_Physics from "../engine/sys-physics.js";
import Render from "../engine/sys-render.js";
import { RigidBodyCharacter } from "./character/character.js";
import PlayerController from "./character/controller-player.js";
import TestController from "./character/controller-test.js";

import CharacterFloatingType from "./character/floating-type.js";
import CharacterPlayerType from "./character/player-type.js";
// import Player from "./player.js";



export default class Game extends Scene
{
    thing:  RigidBodyCharacter;
    player: RigidBodyCharacter;

    constructor()
    {
        super();
    }

    preload( engine: Engine ): void
    {
        const imgsys = engine.getSystem(sys_Image);
    
        imgsys.load("assets/img/meat.jpg");
        imgsys.load("assets/img/michael.png");
        imgsys.load("assets/img/heart-red.png");
        imgsys.load("assets/img/rope.png");

    }

    setup( engine: Engine ): void
    {
        angleMode(RADIANS);

        const controller1 = new PlayerController();
        const controller2 = new TestController();
        this.player = new CharacterPlayerType(0, 128, controller1);
        this.thing = new CharacterFloatingType(0, 0, controller2);

    }

    update( engine: Engine ): void
    {
        super.update(engine);

        imageMode(CENTER);

        this.player.update();
        this.player.draw();

        this.thing.update();
        this.thing.draw();

        const wmouse = Render.worldMouse();
        const r0 = this.thing.sprite.radius;
        const r1 = this.player.sprite.radius;

        if (IO.mouseClicked() && wmouse.distSq(this.thing.world.pos) < r0*r0)
        {
            const A = this.player.popController();
            console.log(A);
            this.thing.pushController(A);
        }


        if (IO.mouseClicked() && wmouse.distSq(this.player.world.pos) < r1*r1)
        {
            const A = this.thing.popController();
            this.player.pushController(A);
        }

    }
}

