import { iTransformable } from "../../engine/interface";
import { Game } from "../game.js";


export type iControllable = iTransformable & {
    move( x: number, y: number ): void;
    jump(): void;
    rotate( theta: number ): void;
    interact( x: number, y: number, msg: string ): void;
}


export class CharacterController
{
    private static _first_instance   = true;
    private static _timer:    number = 0;
    private static _tickrate: number = 1.0/60.0;
    private static _controllers: Array<CharacterController>;

    protected is_good = false;

    constructor()
    {
        if (CharacterController._first_instance == true)
        {
            const tickrate = Game.GlobalConfig["CharacterControllerTickRate"];
            CharacterController._tickrate = 1.0 / tickrate
            CharacterController._first_instance = false;

            CharacterController._controllers = new Array<CharacterController>()
        }

        CharacterController._controllers.push(this);
    }


    public static updateAll()
    {
        CharacterController._timer += (deltaTime / 1000.0);
    
        if (CharacterController._timer >= CharacterController._tickrate)
        {
            for (let ctl of CharacterController._controllers)
            {
                ctl.is_good = true;
            }

            CharacterController._timer = 0;
        }

        else
        {
            for (let ctl of CharacterController._controllers)
            {
                ctl.is_good = false;
            }
        }
    }

    update( C: iControllable ) {  };
}

