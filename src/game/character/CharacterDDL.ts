import { Engine } from "../../engine/engine.js";
import vec2 from "../../engine/math/vec2.js";
import { iCharacterController } from "../controller/controller.js";
import { Game } from "../game.js";
import CharacterFloating from "./CharacterFloating.js";




export default class CharacterDDL extends CharacterFloating
{
    grabbiness = 0;

    constructor( x: number, y: number, ropegroup: Group, controller?: iCharacterController )
    {
        super(x, y, ropegroup, controller);

    }


    update()
    {
        super.update();

        
    }


    draw()
    {
        super.draw();

    }


    move( x: number, y: number ): void
    {
        super.move(x, y);
    }


    interact( x: number, y: number, msg?: string ): void
    {
        const dir = vec2.tmp(x, y).sub(this.world.pos).normalize();

    }

}

