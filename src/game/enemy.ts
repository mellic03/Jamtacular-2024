import { Engine, __engine } from "../engine/engine.js";
import sys_Event from "../engine/sys-event.js";
import sys_Image from "../engine/sys-image.js";
import Character from "./character/character.js";
import Game from "./game.js";


export default class Enemy extends Character
{
    constructor( x: number, y: number )
    {
        super(x, y);
    }

    update( engine: Engine )
    {
        const gameScene = engine.getScene(Game);

        let Player = gameScene.player.pos;
        this.moveTo(Player);
    }

    draw( engine: Engine )
    {
        // fill(255, 0, 0);
        // const imgSys = engine.getSystem(sys_Image);
        // const enemyImg = imgSys.get('assets/img/enemyImg.png');
        // image(enemyImg, this.x, this.y);
    }

}

