import { Engine, __engine } from "../engine/engine.js";
import CollisionGroup from "../engine/physics/group.js";
import Scene from "../engine/scene.js";
import sys_Image from "../engine/sys-image.js";
import sys_Physics from "../engine/sys-physics.js";
import PlayerController from "./character/controller-player.js";
import CharacterFloatingType from "./character/floating-type.js";
import Player from "./player.js";


export default class Game extends Scene
{
    player: CharacterFloatingType;

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
        const physys = engine.getSystem(sys_Physics);
        physys.createGroup("default", new CollisionGroup(0, 0, true));

        const controller = new PlayerController();
        this.player = new CharacterFloatingType(0, 0, controller);
        // this.addActor(this.player);

    }

    update( engine: Engine ): void
    {
        super.update(engine);

        this.player.update(engine);
        this.player.draw(engine);

    }
}

